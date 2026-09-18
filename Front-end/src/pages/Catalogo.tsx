import { useState, useEffect } from 'react'
import type { Plato as DatosPlato } from '../data/tipos'
import { API } from '../data/constantes'
import Plato from '../components/Plato'

export default function Catalogo() {
  const [listaPlatos, setListaPlatos] = useState<DatosPlato[]>([])
  const [cargando, setCargando] = useState(true)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')

  useEffect(() => {
    fetch(API + '/platos')
      .then((r) => r.json())
      .then((datos) => {
        // el precio viene como texto desde la base, lo paso a numero
        setListaPlatos(datos.map((p: DatosPlato) => ({ ...p, precio: Number(p.precio) })))
        setCargando(false)
      })
  }, [])

  function agregar() {
    if (nombre === '' || precio === '') return

    const nuevo = {
      id: Date.now(), // la hora actual, asi no se repite
      nombre: nombre,
      precio: Number(precio),
    }

    setListaPlatos([...listaPlatos, nuevo])
    setNombre('')
    setPrecio('')
  }

  function borrar(id: number) {
    setListaPlatos(listaPlatos.filter((p) => p.id !== id))
  }

  return (
    <div>
      <h1>Catalogo de platos</h1>

      <p>
        <input
          type="text"
          placeholder="Nombre del plato"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <button type="button" onClick={agregar}>Agregar</button>
      </p>

      {cargando ? (
        <p>Buscando los platos...</p>
      ) : listaPlatos.length === 0 ? (
        <p>Todavia no hay platos cargados.</p>
      ) : (
        listaPlatos.map((plato) => (
          <Plato key={plato.id} plato={plato} onBorrar={borrar} />
        ))
      )}
    </div>
  )
}