import type { Mesa, EstadoMesa, Solicitud } from '../data/tipos'
import { TEXTO_MOTIVO, esperaDe } from './Llamados'
import './PopUp.css'

// para mostrar el estado con acento y mayuscula, sin cambiar el dato
const TEXTO_ESTADO: Record<EstadoMesa, string> = {
  vacia: 'Vacía',
  ocupada: 'Ocupada',
  llamando: 'Llamando',
}

// cuantas franjas entran arriba antes de resumir el resto en un renglon
const FRANJAS_VISIBLES = 3

type Props = {
  mesa: Mesa
  // los llamados pendientes de esta mesa. los filtra la pagina, que es la
  // que tiene todas las solicitudes
  llamados: Solicitud[]
  onCambiarEstado: (id: number, nuevo: EstadoMesa) => void
  onCerrar: () => void
  onCuenta: () => void
}

export default function PopUp({ mesa, llamados, onCambiarEstado, onCerrar, onCuenta }: Props) {
  // los de prioridad primero. entre los que empatan, sort deja el orden de llegada
  const ordenados = [...llamados].sort((a, b) => (b.prioridad ? 1 : 0) - (a.prioridad ? 1 : 0))
  const aLaVista = ordenados.slice(0, FRANJAS_VISIBLES)
  const resto = llamados.length - aLaVista.length

  return (
    <div className="fondo-oscuro">
      <div className="popup">
        {aLaVista.map((s) => (
          <div key={s.id} className="franja-llamado">
            <span className="motivo">Pide: {TEXTO_MOTIVO[s.tipo] || s.tipo}</span>
            {s.prioridad && <span className="chapa-prioridad">Prioridad</span>}
            <span className="espera">{esperaDe(s)}</span>
          </div>
        ))}

        {resto > 0 && (
          <div className="franja-mas">
            y {resto} llamado{resto === 1 ? '' : 's'} mas
          </div>
        )}

        <div className="popup-cuerpo">
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
              <p className="ayuda">Si la cuenta tiene platos, te pregunta antes de borrarlos.</p>
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
                Solo el encargado puede apagar el llamado desde su panel.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}