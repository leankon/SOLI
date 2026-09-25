import type { Mesa as DatosMesa } from '../data/tipos'
import './mesa.css'

const ANCHO_SILLA = 16
const ALTO_SILLA = 12
// aire entre el borde de la mesa y la silla
const AIRE = 2

// cuanto sobresalen las sillas de la mesa. el contenedor necesita este
// margen de cada lado para que no queden cortadas
export const MARGEN_SILLAS = 16

// reparto por lado: primero una en cada uno, y lo que sobra empieza por arriba
function lugaresPorLado(n: number) {
  const base = Math.floor(n / 4)
  const resto = n - base * 4
  const lados = [base, base, base, base] // arriba, abajo, izquierda, derecha
  for (let i = 0; i < resto; i++) lados[i]++
  return lados
}

// donde va cada silla, en coordenadas de adentro del contenedor
function posicionesDeSillas(tamano: number, forma: DatosMesa['forma'], lugares: number) {
  const centro = MARGEN_SILLAS + tamano / 2
  const radio = tamano / 2 + AIRE + ALTO_SILLA / 2
  const sillas = []

  if (forma === 'circular') {
    // en una mesa redonda se reparten parejas alrededor de los 360 grados
    for (let i = 0; i < lugares; i++) {
      const vuelta = (i * 2 * Math.PI) / lugares
      sillas.push({
        x: centro + radio * Math.sin(vuelta),
        y: centro - radio * Math.cos(vuelta),
        grados: (i * 360) / lugares,
      })
    }
    return sillas
  }

  // en una cuadrada van por lado, si no quedarian sillas en las esquinas
  const [arriba, abajo, izquierda, derecha] = lugaresPorLado(lugares)
  const borde = MARGEN_SILLAS

  for (let i = 0; i < arriba; i++) {
    sillas.push({ x: borde + (tamano * (i + 1)) / (arriba + 1), y: centro - radio, grados: 0 })
  }
  for (let i = 0; i < abajo; i++) {
    sillas.push({ x: borde + (tamano * (i + 1)) / (abajo + 1), y: centro + radio, grados: 180 })
  }
  for (let i = 0; i < izquierda; i++) {
    sillas.push({ x: centro - radio, y: borde + (tamano * (i + 1)) / (izquierda + 1), grados: 270 })
  }
  for (let i = 0; i < derecha; i++) {
    sillas.push({ x: centro + radio, y: borde + (tamano * (i + 1)) / (derecha + 1), grados: 90 })
  }

  return sillas
}

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
  const sillas = posicionesDeSillas(mesa.tamano, mesa.forma, mesa.lugares || 4)

  function apretar(e: React.MouseEvent) {
    // VistaMozo no manda esta funcion, asi que puede no estar
    if (onMouseDown) onMouseDown(e, mesa)
  }

  return (
    <div
      className="mesa-lugar"
      style={{
        left: mesa.x - MARGEN_SILLAS,
        top: mesa.y - MARGEN_SILLAS,
        width: mesa.tamano + MARGEN_SILLAS * 2,
        height: mesa.tamano + MARGEN_SILLAS * 2,
      }}
    >
      {sillas.map((s, i) => (
        <span
          key={i}
          className="silla"
          style={{
            left: s.x,
            top: s.y,
            transform: 'translate(-50%, -50%) rotate(' + s.grados + 'deg)',
          }}
        />
      ))}

      <button
        type="button"
        onClick={() => onClick(mesa.id)}
        onMouseDown={apretar}
        className={
          'mesa mesa-' + mesa.forma + ' mesa-' + mesa.estado +
          (seleccionada ? ' mesa-seleccionada' : '')
        }
        style={{
          left: MARGEN_SILLAS,
          top: MARGEN_SILLAS,
          width: mesa.tamano,
          height: mesa.tamano,
        }}
      >
        {mesa.numero}
      </button>
    </div>
  )
}