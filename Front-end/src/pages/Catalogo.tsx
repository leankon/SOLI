import { useState, useEffect } from 'react'
import type { Plato } from '../data/tipos'
import { API } from '../data/constantes'
import { useSesion } from '../context/SesionContext'

// 8500 se lee mal. $8.500 se lee de un vistazo
function plata(n: number) {
  return '$' + n.toLocaleString('es-AR')
}

export default function Catalogo() {
  // quien esta adentro y los headers con su token
  const { usuario, cabeceras } = useSesion()
  // hasta que el back lea el id del token lo sigo mandando en el body
  const idUsuario = usuario === null ? 0 : usuario.id
  const [listaPlatos, setListaPlatos] = useState<Plato[]>([])
  const [cargando, setCargando] = useState(true)

  // los dos campos de arriba, para un plato nuevo
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')

  // el plato que se esta editando y lo que van escribiendo.
  // null es que no se esta editando ninguno
  const [idEditando, setIdEditando] = useState<number | null>(null)
  const [nombreEditado, setNombreEditado] = useState('')
  const [precioEditado, setPrecioEditado] = useState('')

  useEffect(() => {
    fetch(API + '/platos', { headers: cabeceras() })
          .then((r) => r.json())
      .then((datos) => {
        // el precio viene como texto desde la base, lo paso a numero
        setListaPlatos(datos.map((p: Plato) => ({ ...p, precio: Number(p.precio) })))
        setCargando(false)
      })
  }, [])

  const agregar = async () => {
    if (nombre === '' || precio === '') return

    try {
      const response = await fetch(API + '/platos', {
        method: 'POST',
        headers: cabeceras(),
        body: JSON.stringify({
          nombre: nombre,
          precio: Number(precio),
          id_usuario: idUsuario,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al agregar el plato')
      }

      // el back devuelve el plato ya guardado, con su id de verdad
      const data = await response.json()
      setListaPlatos([...listaPlatos, { ...data, precio: Number(data.precio) }])
      setNombre('')
      setPrecio('')
    } catch (error) {
      console.error('Hubo un error:', error)
      alert('No se pudo agregar el plato. Fijate la conexion.')
    }
  }

  function empezarAEditar(plato: Plato) {
    setIdEditando(plato.id)
    // arranca con lo que ya tiene, asi solo cambian lo que quieren
    setNombreEditado(plato.nombre)
    setPrecioEditado(String(plato.precio))
  }

  const guardarEdicion = async (id: number) => {
    if (nombreEditado === '' || precioEditado === '') return

    const antes = listaPlatos
    const editado = { id: id, nombre: nombreEditado, precio: Number(precioEditado) }

    // lo cambio ya en pantalla y cierro los campos
    setListaPlatos(listaPlatos.map((p) => (p.id === id ? editado : p)))
    setIdEditando(null)

    try {
      const response = await fetch(API + '/platos/' + id, {
        method: 'PUT',
        headers: cabeceras(),
        // el PUT pisa todas las columnas: van el nombre y el precio juntos
        body: JSON.stringify({
          nombre: editado.nombre,
          precio: editado.precio,
          id_usuario: idUsuario,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al editar el plato')
      }
    } catch (error) {
      console.error('Hubo un error:', error)
      setListaPlatos(antes)
      alert('No se pudo guardar el cambio. Fijate la conexion.')
    }
  }

  const borrar = async (id: number) => {
    const antes = listaPlatos
    setListaPlatos(listaPlatos.filter((p) => p.id !== id))

    try {
      const response = await fetch(API + '/platos/' + id, {
        method: 'DELETE',
        headers: cabeceras(),
        body: JSON.stringify({ id_usuario: idUsuario }),
      })

      if (!response.ok) {
        throw new Error('Error al borrar el plato')
      }
    } catch (error) {
      console.error('Hubo un error:', error)
      setListaPlatos(antes)
      // si ya lo pidieron en alguna cuenta, la base no deja borrarlo
      alert('No se pudo borrar el plato. Puede que este en la cuenta de alguna mesa.')
    }
  }

  return (
    <div>
      <h1>Catalogo de platos</h1>
      <p className="subtitulo">Lo que el mozo puede agregar a la cuenta de una mesa.</p>

      <div className="catalogo">
        <div className="tabla">
          <div className="fila fila-titulos">
            <span>Plato</span>
            <span>Precio</span>
            <span />
          </div>

          {cargando ? (
            <p className="tabla-aviso">Buscando los platos...</p>
          ) : listaPlatos.length === 0 ? (
            <p className="tabla-aviso">Todavia no hay platos cargados. Agrega el primero desde el costado.</p>
          ) : (
            listaPlatos.map((plato) =>
              plato.id === idEditando ? (
                <div className="fila fila-editando" key={plato.id}>
                  <input
                    className="campo"
                    type="text"
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                  />
                  <input
                    className="campo"
                    type="number"
                    value={precioEditado}
                    onChange={(e) => setPrecioEditado(e.target.value)}
                  />
                  <div className="acciones">
                    <button type="button" className="boton-chico boton-chico-acento" onClick={() => guardarEdicion(plato.id)}>
                      Guardar
                    </button>
                    <button type="button" className="boton-chico" onClick={() => setIdEditando(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="fila" key={plato.id}>
                  <span className="nombre">{plato.nombre}</span>
                  <span className="precio">{plata(plato.precio)}</span>
                  <div className="acciones">
                    <button type="button" className="boton-chico" onClick={() => empezarAEditar(plato)}>
                      Editar
                      </button>
                    <button type="button" className="boton-chico boton-chico-peligro" onClick={() => borrar(plato.id)}>
                      Borrar
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>

        <div className="panel-costado">
          <h2>Nuevo plato</h2>

          <p className="etiqueta">Nombre</p>
          <input
            className="campo"
            type="text"
            placeholder="Ej: Milanesa con papas"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <p className="etiqueta">Precio</p>
          <input
            className="campo"
            type="number"
            placeholder="Ej: 8500"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <button
            type="button"
            className="boton-acento boton-ancho"
            onClick={agregar}
            disabled={nombre === '' || precio === ''}
          >
            Agregar plato
          </button>
        </div>
      </div>
    </div>
  )
}