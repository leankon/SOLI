import type { Mesa as DatosMesa } from '../data/tipos'
import './mesa.css'

// le pongo otro nombre al tipo porque el componente ya se llama Mesa
type Props = {
  mesa: DatosMesa
  // esta funcion me la pasa VistaMozo. la mesa no decide que pasa al tocarla,
  // solo avisa "me tocaron" y manda su id. quien decide es el de arriba.
  onClick: (id: number) => void
  seleccionada?: boolean
  // esta solo la usa el editor. manda el evento entero porque de ahi
  // salen las coordenadas del mouse
  onMouseDown?: (e: React.MouseEvent, mesa: DatosMesa) => void
}

export default function Mesa({ mesa, onClick, seleccionada, onMouseDown }: Props) {
  function apretar(e: React.MouseEvent) {
    // VistaMozo no manda esta funcion, asi que puede no estar
    if (onMouseDown) onMouseDown(e, mesa)
  }

  return (
    <button
      type="button"
      onClick={() => onClick(mesa.id)}
      onMouseDown={apretar}
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