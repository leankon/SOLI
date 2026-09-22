import type { Solicitud } from '../data/tipos'

// el dato dice 'pan', pero en pantalla queremos "Pan"
const TEXTO_MOTIVO: Record<string, string> = {
  pan: 'Pan',
  mozo: 'Mozo',
  cuenta: 'Cuenta',
  cancelar: 'Cancelar',
  menu: 'Menu',
}

type Props = {
  solicitud: Solicitud
  // el numero lo busca la pagina, que es la que tiene las mesas
  numeroMesa: number
  // el llamado no se borra solo: avisa "me atendieron" y manda su id
  onAtender: (id: number) => void
}

export default function Llamado({ solicitud, numeroMesa, onAtender }: Props) {
  return (
    <p>
      <strong>Mesa {numeroMesa}</strong> —{' '}
      {/* si la base manda un tipo que no conozco, lo muestro tal cual
          en vez de dejar el renglon a medias */}
      {TEXTO_MOTIVO[solicitud.tipo] || solicitud.tipo} —{' '}
      {/* la hora viene con microsegundos: 20:03:58.577077. me quedo con hora y minuto */}
      {solicitud.hora.slice(0, 5)}{' '}
      <button type="button" onClick={() => onAtender(solicitud.id)}>
        ✓
      </button>
    </p>
  )
}