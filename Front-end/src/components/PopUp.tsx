import type { Mesa, EstadoMesa } from '../data/tipos'
import './PopUp.css'

// para mostrar el estado con acento y mayuscula, sin cambiar el dato
const TEXTO_ESTADO: Record<EstadoMesa, string> = {
  vacia: 'Vacía',
  ocupada: 'Ocupada',
  llamando: 'Llamando',
}

type Props = {
  mesa: Mesa
  onCambiarEstado: (id: number, nuevo: EstadoMesa) => void
  onCerrar: () => void
  onCuenta: () => void
}

export default function PopUp({ mesa, onCambiarEstado, onCerrar, onCuenta }: Props) {
  return (
    <div className="fondo-oscuro">
      <div className="popup">
        <div className="popup-header">
          <h2>Mesa {mesa.numero}</h2>
          <span className={'chip chip-' + mesa.estado}>{TEXTO_ESTADO[mesa.estado]}</span>
          <button type="button" className="cerrar" onClick={onCerrar}>✕</button>
        </div>

        {mesa.estado === 'vacia' && (
          <>
            <p className="ayuda">Todavia no hay nadie sentado.</p>
            <button
              type="button"
              className="boton-principal"
              onClick={() => onCambiarEstado(mesa.id, 'ocupada')}
            >
              Ocupar mesa
            </button>
          </>
        )}

        {mesa.estado === 'ocupada' && (
          <>
            <button type="button" className="boton-principal" onClick={onCuenta}>
              Ver la cuenta
            </button>
            <p className="ayuda">Liberar la mesa no borra lo que pidieron.</p>
            <button
              type="button"
              className="boton-peligro"
              onClick={() => onCambiarEstado(mesa.id, 'vacia')}
            >
              Liberar mesa
            </button>
          </>
        )}

        {/* el mozo ve el llamado pero no lo apaga: eso es del encargado */}
        {mesa.estado === 'llamando' && (
          <>
            <button type="button" className="boton-principal" onClick={onCuenta}>
              Ver la cuenta
            </button>
            <p className="ayuda">
              Esta mesa esta llamando. Solo el encargado puede apagar el llamado desde su panel.
            </p>
          </>
        )}
      </div>
    </div>
  )
}