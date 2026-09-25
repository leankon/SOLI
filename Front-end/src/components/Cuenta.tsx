import { useState, useEffect } from 'react'
import type { Mesa, Plato, LineaPedido } from '../data/tipos'
import { API } from '../data/constantes'
import './PopUp.css'
import './Cuenta.css'

// 8500 se lee mal. $8.500 se lee de un vistazo
function plata(n: number) {
  return '$' + n.toLocaleString('es-AR')
}

type Props = {
  mesa: Mesa
  onCerrar: () => void
}

export default function Cuenta({ mesa, onCerrar }: Props) {
  const [platos, setPlatos] = useState<Plato[]>([])
  const [lineas, setLineas] = useState<LineaPedido[]>([])
  const [cantidades, setCantidades] = useState<Record<number, number>>({})
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // el menu y lo que la mesa ya pidio, los dos juntos
    Promise.all([
      fetch(API + '/platos').then((r) => r.json()),
      fetch(API + '/mesas/' + mesa.id + '/pedido').then((r) => r.json()),
    ]).then(([datosPlatos, datosPedido]) => {
      setPlatos(datosPlatos.map((p: Plato) => ({ ...p, precio: Number(p.precio) })))
      setLineas(datosPedido.map((l: LineaPedido) => ({ ...l, precio: Number(l.precio) })))
      setCargando(false)
    })
  }, [mesa.id])

  // el total no existe en la base: lo sumo cada vez que se dibuja.
  // si manana cambia el precio de un plato, la cuenta de anoche no se mueve
  const total = lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0)

  function cantidadDe(idPlato: number) {
    return cantidades[idPlato] || 1
  }

  function cambiarCantidad(idPlato: number, nueva: number) {
    // las llaves cuadradas guardan con el id del plato como clave,
    // asi cada fila del menu se acuerda de su propia cantidad
    setCantidades({ ...cantidades, [idPlato]: Math.min(20, Math.max(1, nueva)) })
  }

  function agregar(plato: Plato) {
    const ahora = new Date()

    const nueva: LineaPedido = {
      // negativo: esta linea todavia no existe en la base, la invente aca
      id: -Date.now(),
      plato: plato.nombre,
      precio: plato.precio,
      cantidad: cantidadDe(plato.id),
      hora: ahora.toTimeString().slice(0, 8),
      fecha: ahora.toLocaleDateString('sv'),
    }

    setLineas([...lineas, nueva])
    setCantidades({ ...cantidades, [plato.id]: 1 })
  }

  function sacar(idLinea: number) {
    setLineas(lineas.filter((l) => l.id !== idLinea))
  }

  const visibles = platos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="fondo-oscuro">
      <div className="popup">
        <div className="popup-header">
          <h2>Cuenta de la Mesa {mesa.numero}</h2>
          <button type="button" className="cerrar" onClick={onCerrar}>X</button>
        </div>

        {cargando ? (
          <p>Buscando la cuenta...</p>
        ) : (
          <div>
            <h3>Lo que ya pidio</h3>

            {lineas.length === 0 ? (
              <p className="ayuda">Todavia no pidieron nada.</p>
            ) : (
              <div>
                {lineas.map((l) => (
                  <div className="linea" key={l.id}>
                    <span className="nombre">
                      {l.cantidad} x {l.plato}
                    </span>
                    <span className="precio">{plata(l.precio * l.cantidad)}</span>
                    <button type="button" onClick={() => sacar(l.id)}>
                      Sacar
                    </button>
                  </div>
                ))}

                <div className="total">
                  <span>Total</span>
                  <span>{plata(total)}</span>
                </div>
              </div>
            )}

            <h3>Agregar del catalogo</h3>

            <input
              className="buscador"
              placeholder="Buscar plato"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            {visibles.length === 0 ? (
              <p className="ayuda">Ningun plato coincide con esa busqueda.</p>
            ) : (
              visibles.map((p) => (
                <div className="linea" key={p.id}>
                  <span className="nombre">{p.nombre}</span>
                  <span className="precio">{plata(p.precio)}</span>
                  <button type="button" onClick={() => cambiarCantidad(p.id, cantidadDe(p.id) - 1)}>
                    -
                  </button>
                  <span>{cantidadDe(p.id)}</span>
                  <button type="button" onClick={() => cambiarCantidad(p.id, cantidadDe(p.id) + 1)}>
                    +
                  </button>
                  <button type="button" onClick={() => agregar(p)}>
                    Agregar
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}   