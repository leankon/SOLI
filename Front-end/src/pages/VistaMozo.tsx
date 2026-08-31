import { useState } from 'react'
import { mesas as mesasIniciales } from '../data/mesas'
import type { EstadoMesa } from '../data/tipos'
import Mesa from '../components/Mesa'
import PopUp from '../components/PopUp'

export default function VistaMozo() {
  // la lista va en useState porque ahora las mesas cambian de estado
  const [listaMesas, setListaMesas] = useState(mesasIniciales)

  // arranca en null porque al principio no hay ninguna mesa elegida.
  const [idSeleccionada, setIdSeleccionada] = useState<number | null>(null)

  // busco la mesa cada vez que se dibuja. guardo el id y no la mesa entera:
  const mesaSeleccionada = listaMesas.find((m) => m.id === idSeleccionada)

  const ocupadas = listaMesas.filter((m) => m.estado === 'ocupada').length
  const llamando = listaMesas.filter((m) => m.estado === 'llamando').length
  const vacias = listaMesas.filter((m) => m.estado === 'vacia').length

  function cambiarEstado(id: number, nuevo: EstadoMesa) {
    // armo una lista nueva: la mesa que toque va copiada con el estado cambiado
    setListaMesas(
      listaMesas.map((m) => (m.id === id ? { ...m, estado: nuevo } : m))
    )
  }

  return (
    <div>
      <h1>Vista mozo</h1>
      <p>Ocupadas: {ocupadas} &nbsp;&nbsp; Llamando: {llamando} &nbsp;&nbsp; Vacias: {vacias}</p>

      <div className="plano">
        {listaMesas.map((mesa) => (
          <Mesa key={mesa.id} mesa={mesa} onClick={setIdSeleccionada} />
        ))}
      </div>

      {mesaSeleccionada && (
        <PopUp
          mesa={mesaSeleccionada}
          onCambiarEstado={cambiarEstado}
          onCerrar={() => setIdSeleccionada(null)}
        />
      )}
    </div>
  )
}