import { Link } from 'react-router-dom'

type Props = {
  rol: string
  onSalir: () => void
}

export default function Nav({ rol, onSalir }: Props) {
  // sin rol no hay nadie adentro: en el login no va ninguna barra
  if (rol === '') return null

  return (
    <nav>
      <b>SOLI</b>

      {rol === 'mozo' ? (
        <Link to="/mozo">Mesas</Link>
      ) : (
        <>
          <Link to="/encargado">Llamados</Link>
          <Link to="/plano">Editor plano</Link>
          <Link to="/catalogo">Catalogo</Link>
          <Link to="/crear-rol">Crear rol</Link>
        </>
      )}

      <Link to="/login" onClick={onSalir}>Salir</Link>
    </nav>
  )
}