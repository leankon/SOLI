import { useState } from 'react'
import type { Usuario, Rol } from '../data/tipos'
import { usuarios as usuariosIniciales } from '../data/usuarios'
import { EMAIL_RESTAURANTE } from '../data/constantes'

export default function CrearRol() {
  const [lista, setLista] = useState(usuariosIniciales)
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState<Rol>('mozo')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function crear(e: React.FormEvent) {
    e.preventDefault()

    if (nombre === '' || password === '') {
      setError('Completa el nombre y la contrasena')
      return
    }

    // la contrasena es lo unico que distingue a una persona de otra,
    // porque el email es el mismo para todo el restaurante
    if (lista.some((u) => u.password === password)) {
      setError('Esa contrasena ya la usa otra persona')
      return
    }

    const nuevo: Usuario = {
      id: Math.max(0, ...lista.map((u) => u.id)) + 1,
      nombre,
      rol,
      password,
    }

    setLista([...lista, nuevo])
    setNombre('')
    setPassword('')
    setError('')
  }

  function borrar(id: number) {
    setLista(lista.filter((u) => u.id !== id))
  }

  return (
    <div>
      <h1>Crear rol</h1>
      <p>Todos entran con el email {EMAIL_RESTAURANTE}. Lo que cambia es la contrasena.</p>

      <form onSubmit={crear}>
        <p>
          Nombre{' '}
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
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
      <ul>
        {lista.map((u) => (
          <li key={u.id}>
            {u.nombre} — {u.rol}{' '}
            <button type="button" onClick={() => borrar(u.id)}>
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}