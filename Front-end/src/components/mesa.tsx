import type { Mesa as DatosMesa } from '../data/tipos'
import './Mesa.css'

// le pongo otro nombre al tipo porque el componente ya se llama Mesa
type Props = {
  mesa: DatosMesa
  // esta funcion me la pasa VistaMozo. la mesa no decide que pasa al tocarla,
  // solo avisa "me tocaron" y manda su id. quien decide es el de arriba.
  onClick: (id: number) => void
}

export default function Mesa({ mesa, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(mesa.id)}
      className={'mesa mesa-' + mesa.forma + ' mesa-' + mesa.estado}
      style={{
        left: mesa.x,
        top: mesa.y,
        width: mesa.tamaño,
        height: mesa.tamaño,
      }}
    >
      {mesa.numero}
    </button>
  )
}