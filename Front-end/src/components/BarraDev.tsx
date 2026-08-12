import { Link } from 'react-router-dom'

export default function BarraDev() {
  return (
    <nav className="barra-dev">
      <Link to="/login">Login</Link>
      <Link to="/mozo">Mozo</Link>
      <Link to="/encargado">Encargado</Link>
      <Link to="/plano">Plano</Link>
      <Link to="/catalogo">Catalogo</Link>
      <Link to="/simulador">Simulador</Link>
    </nav>
  )
}