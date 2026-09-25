import type { Solicitud } from '../data/tipos'

// el dato dice 'pan', pero en pantalla queremos "Pan"
const TEXTO_MOTIVO: Record<string, string> = {
  pan: 'Pan',
  mozo: 'Mozo',
  cuenta: 'Cuenta',
  cancelar: 'Cancelar',
  menu: 'Menu',
}

// la base guarda el dia y la hora en columnas separadas. las junto en un
// solo momento para poder restarle la hora actual
function momentoDelLlamado(fecha: string, hora: string) {
  return new Date(fecha.slice(0, 10) + 'T' + hora.slice(0, 8))
}

// 5 minutos se cuentan en minutos, 5 horas en horas y 5 dias en dias.
// un numero de minutos gigante no le dice nada al encargado
function textoDeEspera(minutos: number) {
  if (minutos < 1) return 'ahora'
  if (minutos < 60) return 'hace ' + minutos + ' min'

  const horas = Math.floor(minutos / 60)
  if (horas < 24) return 'hace ' + horas + ' h'

  return 'hace ' + Math.floor(horas / 24) + ' dias'
}

type Props = {
  solicitud: Solicitud
  // el numero lo busca la pagina, que es la que tiene las mesas
  numeroMesa: number
  // el llamado no se borra solo: avisa "me atendieron" y manda su id
  onAtender: (id: number) => void
}

export default function Llamado({ solicitud, numeroMesa, onAtender }: Props) {
  const cuando = momentoDelLlamado(solicitud.fecha, solicitud.hora)
  const minutos = Math.floor((Date.now() - cuando.getTime()) / 60000)

  return (
    <p>
      <strong>Mesa {numeroMesa}</strong> —{' '}
      {/* si la base manda un tipo que no conozco, lo muestro tal cual
          en vez de dejar el renglon a medias */}
      {TEXTO_MOTIVO[solicitud.tipo] || solicitud.tipo} — {textoDeEspera(minutos)}{' '}
      <button type="button" onClick={() => onAtender(solicitud.id)}>
        ✓
      </button>
    </p>
  )
}