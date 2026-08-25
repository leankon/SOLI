import type { Llamado as DatosLlamado, Motivo } from '../data/tipos'

// el dato dice 'pan', pero en pantalla queremos "Pan"
const TEXTO_MOTIVO: Record<Motivo, string> = {
  pan: 'Pan',
  mozo: 'Mozo',
  cuenta: 'Cuenta',
  cancelar: 'Cancelar',
  menu: 'Menu',
}

type Props = {
  llamado: DatosLlamado
  // el llamado no se borra solo: avisa "me atendieron" y manda su id
  onAtender: (id: number) => void
}

export default function Llamado({ llamado, onAtender }: Props) {
  return (
    <p>
      <strong>Mesa {llamado.mesa}</strong> — {TEXTO_MOTIVO[llamado.motivo]} — hace{' '}
      {llamado.haceMinutos} min{' '}
      <button type="button" onClick={() => onAtender(llamado.id)}>
        ✓
      </button>
    </p>
  )
}