import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../data/constantes'
import { useSesion } from '../context/SesionContext'

export default function Login() {
  // entrar guarda la persona y su token para toda la app
  const { entrar: guardarSesion } = useSesion()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [entrando, setEntrando] = useState(false)
  const navigate = useNavigate()

  const entrar = async (e: React.FormEvent) => {
    // sin esto el navegador recarga la pagina entera y se pierde todo
    e.preventDefault()

    if (email === '' || password === '') {
      setError('Completa los dos campos')
      return
    }

    setEntrando(true)
    setError('')

    try {
      const response = await fetch(API + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // contrasena sin ñ: asi lo lee el back
        body: JSON.stringify({ email: email, contrasena: password }),
      })

      // 401 no es un error de la pagina: es que los datos no coinciden
      if (response.status === 401) {
        setError('Email o contraseña incorrectos')
        setEntrando(false)
        return
      }

      if (!response.ok) {
        throw new Error('Error al iniciar sesion')
      }

      // el back devuelve mas cosas (apellido, nombre_usuario). me quedo
      // con lo que usan las pantallas
      const data = await response.json()
      guardarSesion({ id: data.id, nombre: data.nombre, rol: data.rol, email: data.nombre_usuario }, data.token)
      if (data.rol === 'mozo') {
        navigate('/mozo')
      } else {
        navigate('/encargado')
      }
    } catch (error) {
      console.error('Hubo un error:', error)
      setError('No se pudo entrar. Fijate la conexion.')
      setEntrando(false)
    }
  }

  return (
    <div className="login">
      <form className="tarjeta-login" onSubmit={entrar}>
        <div>
          <p className="logo">SOLI</p>
          <p className="login-bajada">Entra para ver el salon</p>
        </div>

        <div>
          <p className="etiqueta">Email</p>
          <input
            className="campo"
            type="email"
            placeholder="nombre@restaurante.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <p className="etiqueta">Contraseña</p>
          <input
            className="campo"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-login">{error}</p>}

        <button type="submit" className="boton-acento" disabled={entrando}>
          {entrando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="login-pie">El encargado crea las cuentas de los mozos desde "Crear rol".</p>
      </form>
    </div>
  )
}