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

  const agregarPlato = async (plato: Plato) => {
    try {
      const response = await fetch(API + '/pide', {
         method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // la hora y la fecha las pone el back con CURRENT_TIME y CURRENT_DATE
        body: JSON.stringify({
          mesa_id: mesa.id,
          platos_id: plato.id,
          cantidad: cantidadDe(plato.id),
        }),
      })

      if (!response.ok) {
        throw new Error('Error al agregar el plato')
      }

      const data = await response.json()

      // el back devuelve la fila recien creada, con su id de verdad. el
      // nombre y el precio se los pongo yo: la tabla pide no los guarda
      const nueva: LineaPedido = {
        id: data.id,
        plato: plato.nombre,
        precio: plato.precio,
        cantidad: data.cantidad,
        hora: data.hora,
        fecha: data.fecha,
      }

      setLineas([...lineas, nueva])
      setCantidades({ ...cantidades, [plato.id]: 1 })
    } catch (error) {
      console.error('Hubo un error:', error)
      alert('No se pudo agregar el plato. Fijate la conexion.')
    }
  }

  const sacarPlato = async (idLinea: number) => {
    // lo saco de la pantalla al toque y lo repongo si el borrado falla
    const antes = lineas
    setLineas(lineas.filter((l) => l.id !== idLinea))

    try {
      const response = await fetch(API + '/pide/' + idLinea, {
         method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al sacar el plato')
      }
    } catch (error) {
      console.error('Hubo un error:', error)
      setLineas(antes)
      alert('No se pudo sacar el plato. Fijate la conexion.')
    }
  }

  const visibles = platos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="fondo-oscuro">
      {/* popup-ancho porque aca entran la comanda y el catalogo entero */}
      <div className="popup popup-ancho">
        <div className="popup-cuerpo">
          <div className="popup-header">
            <h2>Cuenta de la Mesa {mesa.numero}</h2>
            <button type="button" className="cerrar" onClick={onCerrar}>✕</button>
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
                      <button type="button" onClick={() => sacarPlato(l.id)}>
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
                    <button type="button" onClick={() => agregarPlato(p)}>
                      Agregar
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}