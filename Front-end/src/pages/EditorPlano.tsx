import { useState } from 'react'
import type { Mesa as DatosMesa } from '../data/tipos'
import { mesas as mesasIniciales } from '../data/mesas'
import Mesa from '../components/mesa'

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
  const [listaMesas, setListaMesas] = useState(mesasIniciales)
  const [idElegida, setIdElegida] = useState<number | null>(null)

  const elegida = listaMesas.find((m) => m.id === idElegida)

  function cambiarTamano(id: number, nuevo: number) {
    setListaMesas(
      listaMesas.map((m) => (m.id === id ? { ...m, tamano: nuevo } : m))
    )
  }

  function cambiarForma(id: number, nueva: DatosMesa['forma']) {
    setListaMesas(
      listaMesas.map((m) => (m.id === id ? { ...m, forma: nueva } : m))
    )
  }

  return (
    <div>
      <h1>Editor de plano</h1>
      <p>Toca una mesa para ver sus datos.</p>

      <div className="plano">
        {listaMesas.map((mesa) => (
          <Mesa
            key={mesa.id}
            mesa={mesa}
            onClick={setIdElegida}
            seleccionada={mesa.id === idElegida}
          />
        ))}
      </div>

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
        </div>
      ) : (
        <p>Ninguna mesa elegida.</p>
      )}
    </div>
  )
}