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
      <p className="subtitulo">Todos entran con el email {miEmail}. Lo que cambia es la contrasena.</p>

      <div className="catalogo">
        <div className="tabla">
          <div className="fila fila-titulos">
            <span>Persona ({lista.length})</span>
            <span>Rol</span>
            <span />
          </div>

          {cargando ? (
            <p className="tabla-aviso">Buscando las personas...</p>
          ) : (
            lista.map((u) => (
              <div className="fila" key={u.id}>
                <span className="nombre">
                  {u.nombre} {u.apellido}
                </span>
                <span>
                  <span className={'chapa-rol chapa-' + u.rol}>
                    {u.rol === 'mozo' ? 'Mozo' : 'Encargado'}
                  </span>
                </span>
                <div className="acciones">
                  {u.id === miId ? (
                    <span className="sos-vos">Sos vos</span>
                  ) : (
                    <button type="button" className="boton-chico boton-chico-peligro" onClick={() => borrar(u.id)}>
                      Borrar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <form className="panel-costado" onSubmit={crear}>
          <h2>Nueva persona</h2>

          <p className="etiqueta">Nombre</p>
          <input className="campo" value={nombre} onChange={(e) => setNombre(e.target.value)} />

          <p className="etiqueta">Apellido</p>
          <input className="campo" value={apellido} onChange={(e) => setApellido(e.target.value)} />

          <p className="etiqueta">DNI</p>
          <input className="campo" value={dni} onChange={(e) => setDni(e.target.value)} />

          <p className="etiqueta">Rol</p>
          <div className="opciones">
            {/* la que esta elegida queda disabled y el css la pinta */}
            <button type="button" className="opcion" onClick={() => setRol('mozo')} disabled={rol === 'mozo'}>
              Mozo
            </button>
            <button type="button" className="opcion" onClick={() => setRol('encargado')} disabled={rol === 'encargado'}>
              Encargado
            </button>
          </div>

          <p className="etiqueta">Contrasena</p>
          <input className="campo" value={password} onChange={(e) => setPassword(e.target.value)} />

          {rol === 'encargado' && (
            <p className="aviso">Ojo: un encargado puede editar el plano, el catalogo y crear mas usuarios.</p>
          )}

          {error !== '' && <p className="error-form">{error}</p>}

          <button type="submit" className="boton-acento boton-ancho">
            Crear
          </button>
        </form>
      </div>
    </div>
  )
}