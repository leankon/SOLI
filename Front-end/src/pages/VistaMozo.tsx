import { useState } from 'react'
import { mesas } from '../data/mesas'
import Mesa from '../components/Mesa'

export default function VistaMozo() {
  // arranca en null porque al principio no hay ninguna mesa elegida.
  const [idSeleccionada, setIdSeleccionada] = useState<number | null>(null)

  // busco la mesa cada vez que se dibuja. guardo el id y no la mesa entera:
  const mesaSeleccionada = mesas.find((m) => m.id === idSeleccionada)

  const ocupadas = mesas.filter((m) => m.estado === 'ocupada').length
  const llamando = mesas.filter((m) => m.estado === 'llamando').length
  const Vacia = mesas.filter((m) => m.estado === 'vacia').length

  return (
    <div>
      <h1>Vista mozo</h1>
      <p>Ocupadas: {ocupadas} &nbsp;&nbsp; Llamando: {llamando} &nbsp;&nbsp; Vacia: {Vacia}</p>

      <div className="plano">
        {mesas.map((mesa) => (
          <Mesa key={mesa.id} mesa={mesa} onClick={setIdSeleccionada} />
        ))}
      </div>

      {mesaSeleccionada && (
        <p>
          Tocaste la <strong>Mesa {mesaSeleccionada.numero}</strong>, que esta{" "}
          {mesaSeleccionada.estado}.
        </p>
      )}
    </div>
  )
}