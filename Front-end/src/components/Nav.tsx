import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Logo from './Logo'
type Props = {
  rol: string
  nombre: string
  onSalir: () => void
}

export default function Nav({ rol, nombre, onSalir }: Props) {
  // el tema queda guardado en el navegador, asi al volver sigue como lo dejaste
  const [tema, setTema] = useState(localStorage.getItem('tema') || 'claro')

  // el css cambia los colores segun el data-theme del html
  useEffect(() => {
    document.documentElement.dataset.theme = tema
    localStorage.setItem('tema', tema)
  }, [tema])

  // sin rol no hay nadie adentro: en el login no va ninguna barra
  if (rol === '') return null

  return (
    <nav>
<Logo className="marca" />
      <div className="links">
        {rol === 'mozo' ? (
          <NavLink to="/mozo">Mesas</NavLink>
        ) : (
          <>
            <NavLink to="/encargado">Llamados</NavLink>
            <NavLink to="/plano">Editor plano</NavLink>
            <NavLink to="/catalogo">Catalogo</NavLink>
            <NavLink to="/crear-rol">Crear rol</NavLink>
          </>
        )}
      </div>

      <div className="sesion">
        <span>{nombre} · {rol}</span>

        <button
          type="button"
          className="boton-barra boton-tema"
          onClick={() => setTema(tema === 'claro' ? 'oscuro' : 'claro')}
        >
          {/* en claro muestro la luna (pasar a oscuro) y en oscuro el sol */}
          {tema === 'claro' ? (
            <svg viewBox="10 10 16 16" fill="none" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 10.5C17.0054 11.4946 16.4467 12.8435 16.4467 14.25C16.4467 15.6565 17.0054 17.0054 18 18C18.9946 18.9946 20.3435 19.5533 21.75 19.5533C23.1565 19.5533 24.5054 18.9946 25.5 18C25.5 19.4834 25.0601 20.9334 24.236 22.1668C23.4119 23.4001 22.2406 24.3614 20.8701 24.9291C19.4997 25.4968 17.9917 25.6453 16.5368 25.3559C15.082 25.0665 13.7456 24.3522 12.6967 23.3033C11.6478 22.2544 10.9335 20.918 10.6441 19.4632C10.3547 18.0083 10.5032 16.5003 11.0709 15.1299C11.6386 13.7594 12.5999 12.5881 13.8332 11.764C15.0666 10.9399 16.5166 10.5 18 10.5Z" />
            </svg>
          ) : (
            <svg viewBox="9 9 18 18" fill="none" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round">
              <path d="M21.3332 17.9993C21.3332 19.8403 19.8408 21.3327 17.9998 21.3327C16.1589 21.3327 14.6665 19.8403 14.6665 17.9993C14.6665 16.1584 16.1589 14.666 17.9998 14.666C19.8408 14.666 21.3332 16.1584 21.3332 17.9993Z" />
              <path d="M17.9998 9.66602V11.3327M17.9998 24.666V26.3327M12.1082 12.1077L13.2832 13.2827M22.7165 22.716L23.8915 23.891M9.6665 17.9993H11.3332M24.6665 17.9993H26.3332M13.2832 22.716L12.1082 23.891M23.8915 12.1077L22.7165 13.2827" />
            </svg>
          )}
        </button>

        <Link to="/login" className="boton-barra" onClick={onSalir}>Salir</Link>
      </div>
    </nav>
  )
}