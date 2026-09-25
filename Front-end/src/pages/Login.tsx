import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Usuario } from '../data/tipos'
import { usuarios } from '../data/usuarios'
import { EMAIL_RESTAURANTE } from '../data/constantes'

type Props = {
  setUsuario: (usuario: Usuario) => void
}

export default function Login({ setUsuario }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function entrar(e: React.FormEvent) {
    // sin esto el navegador recarga la pagina entera y se pierde todo
    e.preventDefault()

    if (email === '' || password === '') {
      setError('Completa los dos campos')
      return
    }

    // esto lo va a hacer el back buscar de quien es esa contraseña
    const usuario = usuarios.find((u) => u.password === password)

    if (email !== EMAIL_RESTAURANTE || usuario === undefined) {
      setError('Email o contraseña incorrectos')
      return
    }

    setUsuario(usuario)

    if (usuario.rol === 'mozo') {
      navigate('/mozo')
    } else {
      navigate('/encargado')
    }
  }

  return (
    <div>
      <h1>SOLI</h1>
      <p>Iniciar sesion</p>

      <form onSubmit={entrar}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  )
}