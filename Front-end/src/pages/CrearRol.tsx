import { useState, useEffect } from 'react'
import type { Rol } from '../data/tipos'
import { API } from '../data/constantes'
import { useSesion } from '../context/SesionContext'

// una persona como la devuelve GET /usuarios. la contraseña no viene
type Persona = {
  id: number
  nombre: string
  apellido: string
  rol: Rol
}

export default function CrearRol() {
  const { usuario, cabeceras } = useSesion()
  // para no dejar que el encargado se borre a si mismo
  const miId = usuario === null ? 0 : usuario.id
  // los mozos que crea entran con su mismo email
  const miEmail = usuario === null ? '' : usuario.email
  const [lista, setLista] = useState<Persona[]>([])
  const [cargando, setCargando] = useState(true)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [rol, setRol] = useState<Rol>('mozo')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(API + '/usuarios', { headers: cabeceras() })
      .then((r) => r.json())
      .then((datos) => {
        setLista(datos)
        setCargando(false)
      })
  }, [])

  const crear = async (e: React.FormEvent) => {
    // sin esto el navegador recarga la pagina entera y se pierde todo
    e.preventDefault()

    if (nombre === '' || apellido === '' || password === '') {
      setError('Completa el nombre, el apellido y la contrasena')
      return
    }

    try {
      const response = await fetch(API + '/usuarios', {
        method: 'POST',
        headers: cabeceras(),
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          dni: dni,
          // todos entran con el mismo email: lo que cambia es la contrasena
          nombre_usuario: miEmail,
          // con n porque asi la lee hoy el back. si martin la pasa a
          // contrasena, se cambia solo esta palabra
          contrasena: password,
          rol: rol,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear la persona')
      }

      // del back solo uso el id: el resto ya lo tengo en el formulario
      const data = await response.json()
      setLista([...lista, { id: data.id, nombre, apellido, rol }])

      setNombre('')
      setApellido('')
      setDni('')
      setPassword('')
      setError('')
    } catch (error) {
      console.error('Hubo un error:', error)
      setError('No se pudo crear. Fijate la conexion.')
    }
  }

  const borrar = async (id: number) => {
    // no muestro el boton de borrar en mi propia fila, pero lo chequeo aca
    // igual: la pantalla puede cambiar, la regla no
    if (id === miId) return

    const antes = lista
    setLista(lista.filter((u) => u.id !== id))

    try {
      const response = await fetch(API + '/usuarios/' + id, {
        method: 'DELETE',
        headers: cabeceras(),
      })

      if (!response.ok) {
        throw new Error('Error al borrar la persona')
      }
    } catch (error) {
      console.error('Hubo un error:', error)
      setLista(antes)
      alert('No se pudo borrar. Fijate la conexion.')
    }
  }

  return (
    <div>
      <h1>Crear rol</h1>
      <p>Todos entran con el email {miEmail}. Lo que cambia es la contrasena.</p>

      <form onSubmit={crear}>
        <p>
          Nombre{' '}
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </p>

        <p>
          Apellido{' '}
          <input value={apellido} onChange={(e) => setApellido(e.target.value)} />
        </p>

        <p>
          DNI{' '}
          <input value={dni} onChange={(e) => setDni(e.target.value)} />
        </p>

        <p>
          Rol{' '}
          <select value={rol} onChange={(e) => setRol(e.target.value as Rol)}>
            <option value="mozo">Mozo</option>
            <option value="encargado">Encargado</option>
          </select>
        </p>

        <p>
          Contrasena{' '}
          <input value={password} onChange={(e) => setPassword(e.target.value)} />
        </p>

        {rol === 'encargado' && (
          <p>Ojo: un encargado puede editar el plano, el catalogo y crear mas usuarios.</p>
        )}

        {error !== '' && <p>{error}</p>}

        <button type="submit">Crear</button>
      </form>

      <h2>Personas cargadas ({lista.length})</h2>

      {cargando ? (
        <p>Buscando las personas...</p>
      ) : (
        <ul>
          {lista.map((u) => (
            <li key={u.id}>
              {u.nombre} {u.apellido} — {u.rol}{' '}
              {u.id === miId ? (
                <span>(sos vos)</span>
              ) : (
                <button type="button" onClick={() => borrar(u.id)}>
                  Borrar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}