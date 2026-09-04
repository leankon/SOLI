import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usuarios } from '../data/usuarios'
import { EMAIL_RESTAURANTE } from '../data/constantes'

type Props = {
  setRol: (rol: string) => void
}

export default function Login({ setRol }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function entrar() {
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

    setRol(usuario.rol)

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
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={entrar}>Entrar</button>
      {error && <p>{error}</p>}
      <p><Link to="/login-mozo">¿Sos mozo? Entra aca</Link></p>
    </div>
  )
}