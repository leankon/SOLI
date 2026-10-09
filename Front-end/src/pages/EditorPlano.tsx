import { useState, useEffect } from 'react'
import type { Mesa as DatosMesa } from '../data/tipos'
import { API, tamano_MESA } from '../data/constantes'
import Mesa from '../components/mesa'

// el mismo tamano que tiene .plano en el css
const ANCHO_PLANO = 1000
const ALTO_PLANO = 520

// sacados de la escala del figma (de 48 a 123). la mediana es la de siempre,
// la que usan las mesas nuevas
const TAMANOS = [
  { nombre: 'Chica', px: 63 },
  { nombre: 'Mediana', px: tamano_MESA },
  { nombre: 'Grande', px: 108 },
]

const FORMAS = [
  { nombre: 'Cuadrada', valor: 'cuadrado' },
  { nombre: 'Redonda', valor: 'circular' },
] as const

// los mismos que use en el figma: de a dos, de a cuatro y de a seis
const LUGARES = [2, 4, 6]

// cuanto se corre cada mesa nueva para no taparse con la anterior:
// la mesa, las sillas de los dos lados y un poco de aire
const PASO = tamano_MESA + 40

type Props = {
  // quien esta editando. viaja en cada cambio que se guarda
  idUsuario: number
}

export default function EditorPlano({ idUsuario }: Props) {
  const [listaMesas, setListaMesas] = useState<DatosMesa[]>([])
  // como estan las mesas en la base. comparando con esta se cuales cambie
  const [guardadas, setGuardadas] = useState<DatosMesa[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [idElegida, setIdElegida] = useState<number | null>(null)
  const [idArrastrada, setIdArrastrada] = useState<number | null>(null)
  const [agarre, setAgarre] = useState({ x: 0, y: 0 })

  const elegida = listaMesas.find((m) => m.id === idElegida)

  // una mesa cambio si alguno de sus datos no es igual al de la base
  const cambiadas = listaMesas.filter((m) => {
    const enLaBase = guardadas.find((g) => g.id === m.id)
    return JSON.stringify(m) !== JSON.stringify(enLaBase)
  })

  useEffect(() => {
    fetch(API + '/mesas')
      .then((r) => r.json())
      .then((datos) => {
        setListaMesas(datos)
        setGuardadas(datos)
        setCargando(false)
      })
  }, [])

  // mover, forma, tamano y lugares se guardan todos juntos con el boton
  const guardar = async () => {
    setGuardando(true)

    try {
      // un PUT por cada mesa que cambio. el PUT pisa todas las columnas,
      // asi que siempre va la mesa entera
      for (const mesa of cambiadas) {
        const response = await fetch(API + '/mesas/' + mesa.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...mesa, id_usuario: idUsuario }),
        })

        if (!response.ok) {
          throw new Error('Error al guardar la mesa ' + mesa.numero)
        }
      }

      setGuardadas(listaMesas)
    } catch (error) {
      console.error('Hubo un error:', error)
      alert('No se pudo guardar el plano. Fijate la conexion y volve a apretar Guardar.')
    }

    setGuardando(false)
  }

  // crear y borrar van a la base en el momento: la mesa nueva necesita
  // el id que le pone la base
  const agregar = async (forma: DatosMesa['forma']) => {
    const numeros = listaMesas.map((m) => m.numero)
    // cuantas entran en una fila antes de pasarse del borde del plano
    const porFila = Math.floor((ANCHO_PLANO - 40) / PASO)

    // sin id: el id lo pone la base
    const nueva = {
      numero: Math.max(0, ...numeros) + 1,
      // las nuevas salen en fila para que no se tapen entre si
      x: 20 + (listaMesas.length % porFila) * PASO,
      y: 20,
      tamano: tamano_MESA,
      forma,
      lugares: 4,
      estado: 'vacia',
      id_usuario: idUsuario,
    }

    try {
      const response = await fetch(API + '/mesas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nueva),
      })

      if (!response.ok) {
        throw new Error('Error al crear la mesa')
      }

      // el back devuelve la mesa ya guardada, con su id de verdad
      const data = await response.json()
      setListaMesas([...listaMesas, data])
      setGuardadas([...guardadas, data])
      setIdElegida(data.id)
    } catch (error) {
      console.error('Hubo un error:', error)
      alert('No se pudo crear la mesa. Fijate la conexion.')
    }
  }

  const borrar = async (id: number) => {
    try {
      const response = await fetch(API + '/mesas/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_usuario: idUsuario }),
      })

      if (!response.ok) {
        throw new Error('Error al borrar la mesa')
      }

      setListaMesas(listaMesas.filter((m) => m.id !== id))
      setGuardadas(guardadas.filter((m) => m.id !== id))
      setIdElegida(null)
    } catch (error) {
      console.error('Hubo un error:', error)
      alert('No se pudo borrar la mesa. Puede que tenga pedidos o llamados guardados.')
    }
  }

  // forma, tamano y lugares: solo en pantalla hasta que aprieten Guardar
  function cambiarMesa(id: number, cambios: Partial<DatosMesa>) {
    setListaMesas(listaMesas.map((m) => (m.id === id ? { ...m, ...cambios } : m)))
  }

  function agarrar(e: React.MouseEvent, mesa: DatosMesa) {
    // sin esto el navegador cree que quiero seleccionar el numero de la mesa
    e.preventDefault()
    setIdArrastrada(mesa.id)
    // de que punto de la mesa la agarre. sin esto la mesa salta al cursor
    setAgarre({ x: e.clientX - mesa.x, y: e.clientY - mesa.y })
  }

  function mover(e: React.MouseEvent) {
    if (idArrastrada === null) return

    const mesa = listaMesas.find((m) => m.id === idArrastrada)
    if (mesa === undefined) return

    // la mesa no se puede salir del plano: minimo 0, maximo el borde menos su tamano
    const x = Math.min(Math.max(e.clientX - agarre.x, 0), ANCHO_PLANO - mesa.tamano)
    const y = Math.min(Math.max(e.clientY - agarre.y, 0), ALTO_PLANO - mesa.tamano)

    setListaMesas(listaMesas.map((m) => (m.id === idArrastrada ? { ...m, x, y } : m)))
  }

  function soltar() {
    setIdArrastrada(null)
  }

  if (cargando) {
    return (
      <div>
        <h1>Editor de plano</h1>
        <p>Buscando las mesas...</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Editor de plano</h1>
      <p>Arrastra una mesa para moverla. Tocala para ver sus datos.</p>

      <p>
        <button type="button" onClick={() => agregar('cuadrado')}>
          + Mesa cuadrada
        </button>{' '}
        <button type="button" onClick={() => agregar('circular')}>
          + Mesa redonda
        </button>{' '}
        <button
          type="button"
          onClick={guardar}
          disabled={cambiadas.length === 0 || guardando}
        >
          {guardando ? 'Guardando...' : 'Guardar plano'}
        </button>
      </p>

      <div className="editor">
        <div
          className="plano"
          onMouseMove={mover}
          onMouseUp={soltar}
          onMouseLeave={soltar}
        >
          {listaMesas.length === 0 ? (
            <p>El salon todavia no tiene mesas. Agrega la primera con los botones de arriba.</p>
          ) : (
            listaMesas.map((mesa) => (
              <Mesa
                key={mesa.id}
                mesa={mesa}
                onClick={setIdElegida}
                onMouseDown={agarrar}
                seleccionada={mesa.id === idElegida}
              />
            ))
          )}
        </div>

        <div className="editor-panel">
          {elegida ? (
            <div>
              <h2>Mesa {elegida.numero}</h2>

              <p>Forma</p>
              <p>
                {FORMAS.map((f) => (
                  <button
                    key={f.valor}
                    type="button"
                    onClick={() => cambiarMesa(elegida.id, { forma: f.valor })}
                    disabled={elegida.forma === f.valor}
                  >
                    {f.nombre}
                  </button>
                ))}
              </p>

              <p>Tamano</p>
              <p>
                {TAMANOS.map((t) => (
                  <button
                    key={t.px}
                    type="button"
                    onClick={() => cambiarMesa(elegida.id, { tamano: t.px })}
                    disabled={elegida.tamano === t.px}
                  >
                    {t.nombre} ({t.px})
                  </button>
                ))}
              </p>

              <p>Lugares</p>
              <p>
                {LUGARES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => cambiarMesa(elegida.id, { lugares: n })}
                    // las que vienen sin lugares se dibujan con 4 sillas
                    disabled={(elegida.lugares || 4) === n}
                  >
                    {n}
                  </button>
                ))}
              </p>

              <button type="button" onClick={() => borrar(elegida.id)}>
                Borrar mesa
              </button>
            </div>
          ) : (
            <p>Ninguna mesa elegida.</p>
          )}
        </div>
      </div>
    </div>
  )
}