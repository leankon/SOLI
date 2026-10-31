import { useState, useEffect, useRef } from 'react'
import type { Mesa as DatosMesa } from '../data/tipos'
import { API, tamano_MESA, ANCHO_PLANO, ALTO_PLANO } from '../data/constantes'
import { useSesion } from '../context/SesionContext'
import { useAviso } from '../context/AvisoContext'
import Mesa from '../components/mesa'

// la de 8 lugares solo entra en la grande
const TAMANO_GRANDE = 108

// sacados de la escala del figma (de 48 a 123). la mediana es la de siempre,
// la que usan las mesas nuevas
const TAMANOS = [
  { nombre: 'Chica', px: 63 },
  { nombre: 'Mediana', px: tamano_MESA },
  { nombre: 'Grande', px: TAMANO_GRANDE },
]

const FORMAS = [
  { nombre: 'Cuadrada', valor: 'cuadrado' },
  { nombre: 'Redonda', valor: 'circular' },
] as const

// de a dos, de a cuatro, de a seis y de a ocho
const LUGARES = [2, 4, 6, 8]

// cuanto se corre cada mesa nueva para no taparse con la anterior:
// la mesa, las sillas de los dos lados y un poco de aire
const PASO = tamano_MESA + 40

export default function EditorPlano() {
  // quien esta adentro y los headers con su token
  const { usuario, cabeceras } = useSesion()
  const { avisar } = useAviso()
  // hasta que el back lea el id del token lo sigo mandando en el body
  const idUsuario = usuario === null ? 0 : usuario.id
  const [listaMesas, setListaMesas] = useState<DatosMesa[]>([])
  // como estan las mesas en la base. comparando con esta se cuales cambie
  const [guardadas, setGuardadas] = useState<DatosMesa[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  // mientras la base devuelve la mesa nueva, los botones de agregar se apagan
  const [creando, setCreando] = useState(false)
  const [idElegida, setIdElegida] = useState<number | null>(null)
  const [idArrastrada, setIdArrastrada] = useState<number | null>(null)
  const [agarre, setAgarre] = useState({ x: 0, y: 0 })
  const plano = useRef<HTMLDivElement>(null)

  const elegida = listaMesas.find((m) => m.id === idElegida)

  // una mesa cambio si alguno de sus datos no es igual al de la base
  const cambiadas = listaMesas.filter((m) => {
    const enLaBase = guardadas.find((g) => g.id === m.id)
    return JSON.stringify(m) !== JSON.stringify(enLaBase)
  })

  useEffect(() => {
    fetch(API + '/mesas', { headers: cabeceras() })
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
          headers: cabeceras(),
          body: JSON.stringify({ ...mesa, id_usuario: idUsuario }),
        })

        if (!response.ok) {
          throw new Error('Error al guardar la mesa ' + mesa.numero)
        }
      }

      setGuardadas(listaMesas)
    } catch (error) {
      console.error('Hubo un error:', error)
      avisar('No se pudo guardar el plano', 'Fijate la conexion y volve a apretar Guardar.')
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

    setCreando(true)

    try {
      const response = await fetch(API + '/mesas', {
        method: 'POST',
        headers: cabeceras(),
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
      avisar('No se pudo crear la mesa', 'Fijate la conexion.')
    }

    setCreando(false)
  }

  const borrar = async (id: number) => {
    try {
      const response = await fetch(API + '/mesas/' + id, {
        method: 'DELETE',
        headers: cabeceras(),
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
      avisar('No se pudo borrar la mesa', 'Puede que tenga pedidos o llamados guardados.')
    }
  }

  // forma, tamano y lugares: solo en pantalla hasta que aprieten Guardar
  function cambiarMesa(id: number, cambios: Partial<DatosMesa>) {
    setListaMesas(listaMesas.map((m) => (m.id === id ? { ...m, ...cambios } : m)))
  }

  // el mouse viene en pixeles de pantalla y las mesas en unidades del plano
  function aUnidades(e: React.MouseEvent) {
    if (plano.current === null) return { x: 0, y: 0 }
    const caja = plano.current.getBoundingClientRect()
    const unidad = caja.width / ANCHO_PLANO
    return { x: (e.clientX - caja.left) / unidad, y: (e.clientY - caja.top) / unidad }
  }

  function agarrar(e: React.MouseEvent, mesa: DatosMesa) {
    // sin esto el navegador cree que quiero seleccionar el numero de la mesa
    e.preventDefault()
    setIdArrastrada(mesa.id)
    // de que punto de la mesa la agarre. sin esto la mesa salta al cursor
    const mouse = aUnidades(e)
    setAgarre({ x: mouse.x - mesa.x, y: mouse.y - mesa.y })
  }

  function mover(e: React.MouseEvent) {
    if (idArrastrada === null) return

    const mesa = listaMesas.find((m) => m.id === idArrastrada)
    if (mesa === undefined) return

    // la mesa no se puede salir del plano: minimo 0, maximo el borde menos su tamano.
    // redondeo porque en la base x e y son numeros enteros
    const mouse = aUnidades(e)
    const x = Math.round(Math.min(Math.max(mouse.x - agarre.x, 0), ANCHO_PLANO - mesa.tamano))
    const y = Math.round(Math.min(Math.max(mouse.y - agarre.y, 0), ALTO_PLANO - mesa.tamano))

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
      <div className="editor-cabecera">
        <div>
          <h1>Editor de plano</h1>
          <p className="subtitulo">Arrastra una mesa para moverla. Tocala para ver sus datos.</p>
        </div>

        <div className="editor-botones">
          <button
            type="button"
            className="boton-suave"
            onClick={() => agregar('cuadrado')}
            disabled={creando}
          >
            {creando ? 'Creando...' : '+ Mesa cuadrada'}
          </button>
          <button
            type="button"
            className="boton-suave"
            onClick={() => agregar('circular')}
            disabled={creando}
          >
            {creando ? 'Creando...' : '+ Mesa redonda'}
          </button>
          <button
            type="button"
            className="boton-acento"
            onClick={guardar}
            disabled={cambiadas.length === 0 || guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar plano'}
          </button>
        </div>
      </div>

      <div className="editor">
        <div
          className="plano"
          ref={plano}
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
                // en el editor el estado no importa: todas se ven libres,
                // asi se ve el salon y no quien esta sentado
                mesa={{ ...mesa, estado: 'vacia' }}
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

              <p className="etiqueta">Forma</p>
              <div className="opciones">
                {FORMAS.map((f) => (
                  <button
                    key={f.valor}
                    type="button"
                    className="opcion"
                    onClick={() => cambiarMesa(elegida.id, { forma: f.valor })}
                    disabled={elegida.forma === f.valor}
                  >
                    {f.nombre}
                  </button>
                ))}
              </div>

              <p className="etiqueta">Tamano</p>
              {/* en el figma van uno abajo del otro */}
              <div className="opciones opciones-columna">
                {TAMANOS.map((t) => (
                  <button
                    key={t.px}
                    type="button"
                    className="opcion opcion-tamano"
                    onClick={() =>
                      cambiarMesa(elegida.id, {
                        tamano: t.px,
                        // si achican una mesa de 8 le dejo 6, si no las sillas se pisan
                        lugares: t.px !== TAMANO_GRANDE && elegida.lugares === 8 ? 6 : elegida.lugares,
                      })
                    }
                    disabled={elegida.tamano === t.px}
                  >
                    {t.nombre}
                  </button>
                ))}
              </div>

              <p className="etiqueta">Lugares</p>
              <div className="opciones">
                {LUGARES.filter((n) => n < 8 || elegida.tamano === TAMANO_GRANDE).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="opcion"
                    onClick={() => cambiarMesa(elegida.id, { lugares: n })}
                    // las que vienen sin lugares se dibujan con 4 sillas
                    disabled={(elegida.lugares || 4) === n}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button type="button" className="boton-borrar" onClick={() => borrar(elegida.id)}>
                Borrar mesa
              </button>
            </div>
          ) : (
            <p className="sin-elegir">Toca una mesa del plano para cambiarle la forma, el tamano o los lugares.</p>
          )}
        </div>
      </div>
    </div>
  )
}