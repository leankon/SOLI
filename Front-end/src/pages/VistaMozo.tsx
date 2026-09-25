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

  const ocupadas = listaMesas.filter((m) => m.estado === 'ocupada').length
  const llamando = listaMesas.filter((m) => m.estado === 'llamando').length
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
    // armo una lista nueva: la mesa que toque va copiada con el estado cambiado
    setListaMesas(
      listaMesas.map((m) => (m.id === id ? { ...m, estado: nuevo } : m))
    )
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
      <p>Ocupadas: {ocupadas} &nbsp;&nbsp; Llamando: {llamando} &nbsp;&nbsp; Vacias: {vacias}</p>

      <div className="plano">
        {listaMesas.length === 0 ? (
          <p>El salon todavia no tiene mesas. El encargado las carga desde el editor de plano.</p>
        ) : (
          listaMesas.map((mesa) => (
            <Mesa key={mesa.id} mesa={mesa} onClick={setIdSeleccionada} />
          ))
        )}
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