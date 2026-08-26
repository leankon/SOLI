import type { Plato as DatosPlato } from '../data/tipos'

type Props = {
  plato: DatosPlato
  onBorrar: (id: number) => void
}

export default function Plato({ plato, onBorrar }: Props) {
  return (
    <p>
      {plato.nombre} — ${plato.precio}{' '}
      <button type="button" onClick={() => onBorrar(plato.id)}>
        Borrar
      </button>
    </p>
  )
}