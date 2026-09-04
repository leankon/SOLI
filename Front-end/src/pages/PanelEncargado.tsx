import { useState } from 'react'
import { llamados as llamadosIniciales } from '../data/llamados'
import Llamado from '../components/Llamados'

export default function PanelEncargado() {
  const [listaLlamados, setListaLlamados] = useState(llamadosIniciales)

  function atender(id: number) {
    // filter arma un array NUEVO sin el llamado que atendi.
    // no borro nada del viejo: le paso uno nuevo para que React se entere
    setListaLlamados(listaLlamados.filter((l) => l.id !== id))
  }

  return (
    <div>
      <h1>Llamados</h1>

      {listaLlamados.length === 0 ? (
        <p>No hay llamados. Todo tranquilo.</p>
      ) : (
        <div>
          {listaLlamados.map((llamado) => (
            <Llamado key={llamado.id} llamado={llamado} onAtender={atender} />
          ))}
        </div>
      )}
    </div>
  )
}