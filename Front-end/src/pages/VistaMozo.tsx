import { useState, useEffect } from 'react'
import type { Mesa as DatosMesa, EstadoMesa } from '../data/tipos'
import { API } from '../data/constantes'
import Mesa from '../components/mesa'
import PopUp from '../components/PopUp'
import Cuenta from '../components/Cuenta'

export default function VistaMozo() {
  const [listaMesas, setListaMesas] = useState<DatosMesa[]>([])
  const [cargando, setCargando] = useState(true)

  // arranca en null porque al principio no hay ninguna mesa elegida.
  const [idSeleccionada, setIdSeleccionada] = useState<number | null>(null)

  // cual ventana esta abierta sobre esa mesa: el pop up o la cuenta
  const [verCuenta, setVerCuenta] = useState(false)

  // busco la mesa cada vez que se dibuja. guardo el id y no la mesa entera:
  const mesaSeleccionada = listaMesas.find((m) => m.id === idSeleccionada)

  // esta la guardo entera y no contada, porque el panel del costado
  // necesita los numeros de mesa, no cuantas son
  const llamando = listaMesas.filter((m) => m.estado === 'llamando')
  const ocupadas = listaMesas.filter((m) => m.estado === 'ocupada').length
  const vacias = listaMesas.filter((m) => m.estado === 'vacia').length

  useEffect(() => {
    fetch(API + '/mesas')
      .then((r) => r.json())
      .then((datos) => {
        setListaMesas(datos)
        setCargando(false)
      })
  }, [])

  function cambiarEstado(id: number, nuevo: EstadoMesa) {
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
        <span className="pastilla pastilla-llamando">Llamando {llamando.length}</span>
        <span className="pastilla pastilla-vacia">Vacias {vacias}</span>
      </div>

      <div className="mozo">
        <div className="plano">
          {listaMesas.length === 0 ? (
            <p>El salon todavia no tiene mesas. El encargado las carga desde el editor de plano.</p>
          ) : (
            listaMesas.map((mesa) => (
              <Mesa key={mesa.id} mesa={mesa} onClick={setIdSeleccionada} />
            ))
          )}
        </div>

        <div className="panel-llamados">
          <h2>Llamados ({llamando.length})</h2>

          {/* sin boton para apagarlos: el mozo los mira, el encargado los atiende */}
          {llamando.length === 0 ? (
            <p>No hay llamados. Todo tranquilo.</p>
          ) : (
            llamando.map((m) => (
              <p key={m.id}>
                <strong>Mesa {m.numero}</strong>
              </p>
            ))
          )}
        </div>
      </div>

      {mesaSeleccionada && !verCuenta && (
        <PopUp
          mesa={mesaSeleccionada}
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