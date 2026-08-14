import type { Mesa as DatosMesa } from '../data/tipos'
import { TAMAÑO_MESA } from '../data/constantes'
import './Mesa.css'


// le pongo otro nombre al tipo porque el componente ya se llama Mesa
type Props = {
  mesa: DatosMesa
}


export default function Mesa({ mesa }: Props) {
  return (
    <div
      className={'mesa mesa-' + mesa.forma + ' mesa-' + mesa.estado}
      style={{
        left: mesa.x,
        top: mesa.y,
        width: mesa.tamaño,
        height: mesa.tamaño,
      }}
    >
      {mesa.numero}
    </div>
  )
}
