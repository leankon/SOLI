import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EMAIL_RESTAURANTE } from '../data/constantes'
import { usuarios } from '../data/usuarios'

type Props = {
  setRol: (rol: string) => void
}

export default function LoginMozo({ setRol }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function entrar() {
    if (password === '') {
      setError('Escribi tu contraseña')
      return
    }

    // esta pantalla es solo para mozos: la clave del encargado no entra por aca
    const usuario = usuarios.find((u) => u.password === password)

    if (usuario === undefined || usuario.rol !== 'mozo') {
      setError('Esa contraseña no es de ningun mozo')
      return
    }

    setRol('mozo')
    navigate('/mozo')
  }

  return (
    <div>
      <h1>SOLI</h1>
      <p>Entrar como mozo</p>

      <input value={EMAIL_RESTAURANTE} disabled />
      <p>Es el email del restaurante, igual para todos</p>

      <input
        type="password"
        placeholder="Tu contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={entrar}>Entrar</button>
      {error && <p>{error}</p>}

      <p><Link to="/login">Volver al login del encargado</Link></p>
    </div>
  )
}