import type { Mesa as DatosMesa } from '../data/tipos'
import './mesa.css'

// le pongo otro nombre al tipo porque el componente ya se llama Mesa
type Props = {
  mesa: DatosMesa
  // esta funcion me la pasa VistaMozo. la mesa no decide que pasa al tocarla,
  // solo avisa "me tocaron" y manda su id. quien decide es el de arriba.
  onClick: (id: number) => void
  seleccionada?: boolean
}

export default function Mesa({ mesa, onClick, seleccionada }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(mesa.id)}
      className={
        'mesa mesa-' + mesa.forma + ' mesa-' + mesa.estado +
        (seleccionada ? ' mesa-seleccionada' : '')
      }
      style={{
        left: mesa.x,
        top: mesa.y,
        width: mesa.tamano,
        height: mesa.tamano,
      }}
    >
      {mesa.numero}
    </button>
  )
}