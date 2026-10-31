import { useState, useEffect, useRef } from 'react'
import type { Mesa as DatosMesa, EstadoMesa, Solicitud, LineaPedido } from '../data/tipos'
import { API } from '../data/constantes'
import { useSesion } from '../context/SesionContext'
import { useAviso } from '../context/AvisoContext'
import Mesa from '../components/mesa'
import Llamado from '../components/Llamados'
import PopUp from '../components/PopUp'
import Cuenta from '../components/Cuenta'
import ConfirmarLiberar from '../components/ConfirmarLiberar'

export default function VistaMozo() {
  // los headers con el token de quien entro
  const { cabeceras } = useSesion()
  const { avisar } = useAviso()
  const [listaMesas, setListaMesas] = useState<DatosMesa[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [cargando, setCargando] = useState(true)

  // cuando termino el ultimo cambio que hice yo. una lista que el reloj
  // pidio antes de eso viene vieja y me volveria la mesa a como estaba
  const ultimoCambio = useRef(0)

  // arranca en null porque al principio no hay ninguna mesa elegida.
  const [idSeleccionada, setIdSeleccionada] = useState<number | null>(null)

  // cual ventana esta abierta sobre esa mesa: el pop up o la cuenta
  const [verCuenta, setVerCuenta] = useState(false)

  // si quieren liberar una mesa con platos, aca guardo cual y que tiene,
  // para mostrar el cartel antes de borrar nada. null es que no hay cartel
  const [aLiberar, setALiberar] = useState<{ id: number; lineas: LineaPedido[] } | null>(null)

  useEffect(() => {
    const traer = async () => {
      const pedidoEn = Date.now()
      try {
        // pido las dos juntas: el plano sale de las mesas y los llamados de
        // las solicitudes, que son tablas distintas
        const [datosMesas, datosSolicitudes] = await Promise.all([
          fetch(API + '/mesas', { headers: cabeceras() }).then((r) => r.json()),
          fetch(API + '/solicitudes', { headers: cabeceras() }).then((r) => r.json()),
        ])

        // si mientras viajaba la lista yo cambie algo, esta lista es vieja
        if (pedidoEn < ultimoCambio.current) return

        setListaMesas(datosMesas)
        setSolicitudes(datosSolicitudes)
        setCargando(false)
      } catch (error) {
        // no corto nada: en tres segundos vuelve a intentar solo
        console.error('Hubo un error:', error)
      }
    }

    // una vez al entrar, para no esperar tres segundos mirando el cartel
    traer()

    // y despues cada tres segundos: asi el llamado nuevo aparece solo,
    // sin que el mozo tenga que apretar F5
    const reloj = setInterval(traer, 1000)

    // cuando el mozo se va a otra pantalla apago el reloj. si no, sigue
    // preguntando para siempre aunque ya nadie este mirando
    return () => clearInterval(reloj)
  }, [])

  // las atendidas quedan en la base con otro estado, no se borran
  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente')

  // una mesa esta llamando si tiene alguna solicitud pendiente. no lo guardo
  // en la base: lo calculo al dibujar. asi el plano y el panel salen de la
  // misma lista y no pueden decir cosas distintas
  const mesasEnPantalla = listaMesas.map((m) => {
    if (pendientes.some((s) => s.id_mesa === m.id)) {
      return { ...m, estado: 'llamando' as EstadoMesa }
    }
    // 'llamando' no se guarda: sale de los llamados pendientes. si quedo
    // guardado de antes y ya no hay llamados, la mesa sigue ocupada
    if (m.estado === 'llamando') {
      return { ...m, estado: 'ocupada' as EstadoMesa }
    }
    return m
  })

  // busco la mesa cada vez que se dibuja. guardo el id y no la mesa entera:
  const mesaSeleccionada = mesasEnPantalla.find((m) => m.id === idSeleccionada)

  const ocupadas = mesasEnPantalla.filter((m) => m.estado === 'ocupada').length
  const llamando = mesasEnPantalla.filter((m) => m.estado === 'llamando').length
  const vacias = mesasEnPantalla.filter((m) => m.estado === 'vacia').length

  function numeroDeMesa(idMesa: number) {
    const mesa = listaMesas.find((m) => m.id === idMesa)
    // la solicitud guarda el id, que no es el numero. si la mesa ya no esta
    // muestro el id para no inventar un numero que no existe
    return mesa === undefined ? idMesa : mesa.numero
  }

  const cambiarEstado = async (id: number, nuevo: EstadoMesa) => {
    // busco en listaMesas y no en mesasEnPantalla: quiero el estado que esta
    // guardado, no el 'llamando' que agregue yo para pintar
    const mesa = listaMesas.find((m) => m.id === id)
    if (!mesa) return

    // el PUT pisa todas las columnas con lo que le mando, asi que va la mesa
    // entera. mandando solo el estado, numero x y tamano y forma quedan en null
    const actualizada = { ...mesa, estado: nuevo }
    const antes = listaMesas

    // la pinto ya, sin esperar la respuesta, asi el mozo no ve el tilde
    ultimoCambio.current = Date.now()
    setListaMesas(listaMesas.map((m) => (m.id === id ? actualizada : m)))

    try {
      const response = await fetch(API + '/mesas/' + id, {
        method: 'PUT',
        headers: cabeceras(),
        body: JSON.stringify(actualizada),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la mesa')
      }
    } catch (error) {
      console.error('Hubo un error:', error)
      // vuelvo atras: peor es mostrar una mesa libre que en la base sigue ocupada
      setListaMesas(antes)
      avisar('No se pudo guardar el cambio', 'Fijate la conexion.')
    }

    // ya se guardo: lo que el reloj haya pedido hasta aca no sirve
    ultimoCambio.current = Date.now()
  }

  const liberar = async (id: number) => {
    try {
      // antes de liberar me fijo si la cuenta tiene platos
      const response = await fetch(API + '/mesas/' + id + '/pedido', { headers: cabeceras() })
      if (!response.ok) {
        throw new Error('Error al traer la cuenta')
      }
      const lineas = await response.json()

      // con platos no libero todavia: primero pregunto con el cartel
      if (lineas.length > 0) {
        setALiberar({ id: id, lineas: lineas })
        return
      }
    } catch (error) {
      console.error('Hubo un error:', error)
      avisar('No se pudo revisar la cuenta', 'Fijate la conexion.')
      return
    }

    cambiarEstado(id, 'vacia')
  }

  // apretaron "Borrar platos y liberar" en el cartel
  const borrarYLiberar = async () => {
    if (aLiberar === null) return
    const { id, lineas } = aLiberar
    setALiberar(null)

    try {
      for (const linea of lineas) {
        const response = await fetch(API + '/pide/' + linea.id, {
          method: 'DELETE',
          headers: cabeceras(),
        })
        if (!response.ok) {
          throw new Error('Error al borrar un plato de la cuenta')
        }
      }
    } catch (error) {
      console.error('Hubo un error:', error)
      avisar('No se pudo vaciar la cuenta', 'Fijate la conexion.')
      return
    }

    cambiarEstado(id, 'vacia')
  }

  function cerrarTodo() {
    setIdSeleccionada(null)
    setVerCuenta(false)
  }

  if (cargando) {
    return (
      <div>
        <h1>Vista mozo</h1>
        <p>Buscando las mesas...</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Vista mozo</h1>

      <div className="resumen">
        <span className="pastilla pastilla-ocupada">Ocupadas {ocupadas}</span>
        <span className="pastilla pastilla-llamando">Llamando {llamando}</span>
        <span className="pastilla pastilla-vacia">Vacias {vacias}</span>
      </div>

      <div className="mozo">
        <div className="plano">
          {mesasEnPantalla.length === 0 ? (
            <p>El salon todavia no tiene mesas. El encargado las carga desde el editor de plano.</p>
          ) : (
            mesasEnPantalla.map((mesa) => (
              <Mesa key={mesa.id} mesa={mesa} onClick={setIdSeleccionada} />
            ))
          )}
        </div>

        <div className="panel-llamados">
          <h2>Llamados ({pendientes.length})</h2>

          {pendientes.length === 0 ? (
            <p>No hay llamados. Todo tranquilo.</p>
          ) : (
            // sin onAtender no dibuja el boton: el mozo mira, el encargado apaga
            pendientes.map((s) => (
              <Llamado
                key={s.id}
                solicitud={s}
                numeroMesa={numeroDeMesa(s.id_mesa)}
                prioridad={s.prioridad}
              />
            ))
          )}
        </div>
      </div>

      {mesaSeleccionada && !verCuenta && aLiberar === null && (
        <PopUp
          mesa={mesaSeleccionada}
          llamados={pendientes.filter((s) => s.id_mesa === mesaSeleccionada.id)}
          // liberar pasa primero por la cuenta, ocupar va directo
          onCambiarEstado={(id, nuevo) => (nuevo === 'vacia' ? liberar(id) : cambiarEstado(id, nuevo))}
          onCerrar={cerrarTodo}
          onCuenta={() => setVerCuenta(true)}
        />
      )}

      {mesaSeleccionada && verCuenta && (
        <Cuenta mesa={mesaSeleccionada} onCerrar={cerrarTodo} />
      )}

      {mesaSeleccionada && aLiberar !== null && (
        <ConfirmarLiberar
          numeroMesa={mesaSeleccionada.numero}
          lineas={aLiberar.lineas}
          onConfirmar={borrarYLiberar}
          onCancelar={() => setALiberar(null)}
        />
      )}
    </div>
  )
}