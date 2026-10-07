import { useState, useEffect } from 'react'
import type { Mesa as DatosMesa, EstadoMesa, Solicitud } from '../data/tipos'
import { API } from '../data/constantes'
import Mesa from '../components/mesa'
import Llamado from '../components/Llamados'
import PopUp from '../components/PopUp'
import Cuenta from '../components/Cuenta'

export default function VistaMozo() {
  const [listaMesas, setListaMesas] = useState<DatosMesa[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [cargando, setCargando] = useState(true)

  // arranca en null porque al principio no hay ninguna mesa elegida.
  const [idSeleccionada, setIdSeleccionada] = useState<number | null>(null)

  // cual ventana esta abierta sobre esa mesa: el pop up o la cuenta
  const [verCuenta, setVerCuenta] = useState(false)

  useEffect(() => {
    // pido las dos juntas: el plano sale de las mesas y los llamados de las
    // solicitudes, que son tablas distintas
    Promise.all([
      fetch(API + '/mesas').then((r) => r.json()),
      fetch(API + '/solicitudes').then((r) => r.json()),
    ]).then(([datosMesas, datosSolicitudes]) => {
      setListaMesas(datosMesas)
      setSolicitudes(datosSolicitudes)
      setCargando(false)
    })
  }, [])

  // las atendidas quedan en la base con otro estado, no se borran
  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente')

  // una mesa esta llamando si tiene alguna solicitud pendiente. no lo guardo
  // en la base: lo calculo al dibujar. asi el plano y el panel salen de la
  // misma lista y no pueden decir cosas distintas
  const mesasEnPantalla = listaMesas.map((m) =>
    pendientes.some((s) => s.id_mesa === m.id)
      ? { ...m, estado: 'llamando' as EstadoMesa }
      : m
  )

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

  function cambiarEstado(id: number, nuevo: EstadoMesa) {
    // busco en listaMesas y no en mesasEnPantalla: quiero el estado que esta
    // guardado, no el 'llamando' que agregue yo para pintar
    const mesa = listaMesas.find((m) => m.id === id)
    if (!mesa) return

    // el PUT pisa todas las columnas con lo que le mando, asi que va la mesa
    // entera. mandando solo el estado, numero x y tamano y forma quedan en null
    const actualizada = { ...mesa, estado: nuevo }
    const antes = listaMesas

    // la pinto ya, sin esperar la respuesta, asi el mozo no ve el tilde
    setListaMesas(listaMesas.map((m) => (m.id === id ? actualizada : m)))

    fetch(API + '/mesas/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actualizada),
    })
      .then((r) => {
        if (!r.ok) throw new Error('el back no guardo')
      })
      .catch(() => {
        // vuelvo atras: peor es mostrar una mesa libre que en la base sigue ocupada
        setListaMesas(antes)
        alert('No se pudo guardar el cambio. Fijate la conexion.')
      })
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
              <Llamado key={s.id} solicitud={s} numeroMesa={numeroDeMesa(s.id_mesa)} />
            ))
          )}
        </div>
      </div>

      {mesaSeleccionada && !verCuenta && (
        <PopUp
          mesa={mesaSeleccionada}
          llamados={pendientes.filter((s) => s.id_mesa === mesaSeleccionada.id)}
          onCambiarEstado={cambiarEstado}
          onCerrar={cerrarTodo}
          onCuenta={() => setVerCuenta(true)}
        />
      )}

      {mesaSeleccionada && verCuenta && (
        <Cuenta mesa={mesaSeleccionada} onCerrar={cerrarTodo} />
      )}
    </div>
  )
}