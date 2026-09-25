import { useState, useEffect } from 'react'
import type { Mesa as DatosMesa } from '../data/tipos'
import { API } from '../data/constantes'
import Mesa from '../components/mesa'

// el mismo tamano que tiene .plano en el css
const ANCHO_PLANO = 1200
const ALTO_PLANO = 620

const TAMANOS = [
  { nombre: 'Chica', px: 80 },
  { nombre: 'Mediana', px: 110 },
  { nombre: 'Grande', px: 155 },
]

const FORMAS = [
  { nombre: 'Cuadrada', valor: 'cuadrado' },
  { nombre: 'Redonda', valor: 'circular' },
] as const

export default function EditorPlano() {
  const [listaMesas, setListaMesas] = useState<DatosMesa[]>([])
  const [cargando, setCargando] = useState(true)
  const [idElegida, setIdElegida] = useState<number | null>(null)
  const [idArrastrada, setIdArrastrada] = useState<number | null>(null)
  const [agarre, setAgarre] = useState({ x: 0, y: 0 })

  const elegida = listaMesas.find((m) => m.id === idElegida)

  useEffect(() => {
    fetch(API + '/mesas')
      .then((r) => r.json())
      .then((datos) => {
        setListaMesas(datos)
        setCargando(false)
      })
  }, [])

  function agregar(forma: DatosMesa['forma']) {
    const numeros = listaMesas.map((m) => m.numero)
    const nueva: DatosMesa = {
      id: Date.now(),
      numero: Math.max(0, ...numeros) + 1,
      // las nuevas salen en fila para que no se tapen entre si
      x: 20 + (listaMesas.length % 8) * 140,
      y: 20,
      tamano: 110,
      forma,
      estado: 'vacia',
    }
    setListaMesas([...listaMesas, nueva])
    setIdElegida(nueva.id)
  }

  function borrar(id: number) {
    setListaMesas(listaMesas.filter((m) => m.id !== id))
    setIdElegida(null)
  }

  function cambiarTamano(id: number, nuevo: number) {
    setListaMesas(listaMesas.map((m) => (m.id === id ? { ...m, tamano: nuevo } : m)))
  }

  function cambiarForma(id: number, nueva: DatosMesa['forma']) {
    setListaMesas(listaMesas.map((m) => (m.id === id ? { ...m, forma: nueva } : m)))
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
                    onClick={() => cambiarForma(elegida.id, f.valor)}
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
                    onClick={() => cambiarTamano(elegida.id, t.px)}
                    disabled={elegida.tamano === t.px}
                  >
                    {t.nombre} ({t.px})
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