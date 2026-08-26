import { useState } from 'react'
import { platos as platosIniciales } from '../data/platos'
import Plato from '../components/Plato'

export default function Catalogo() {
  const [listaPlatos, setListaPlatos] = useState(platosIniciales)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')

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

      {listaPlatos.length === 0 ? (
        <p>Todavia no hay platos cargados.</p>
      ) : (
        listaPlatos.map((plato) => (
          <Plato key={plato.id} plato={plato} onBorrar={borrar} />
        ))
      )}
    </div>
  )
}