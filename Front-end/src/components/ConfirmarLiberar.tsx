import type { LineaPedido } from '../data/tipos'
import './PopUp.css'
import './Cuenta.css'

// 8500 se lee mal. $8.500 se lee de un vistazo
function plata(n: number) {
  return '$' + n.toLocaleString('es-AR')
}

type Props = {
  numeroMesa: number
  // lo que se va a borrar. lo trae la pagina antes de abrir este cartel
  lineas: LineaPedido[]
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ConfirmarLiberar({ numeroMesa, lineas, onConfirmar, onCancelar }: Props) {
  // el precio viene como texto desde la base, por eso el Number
  const total = lineas.reduce((suma, l) => suma + Number(l.precio) * l.cantidad, 0)

  return (
    <div className="fondo-oscuro">
      <div className="popup">
        <div className="popup-cuerpo">
          <div className="popup-header">
            <h2>¿Liberar la Mesa {numeroMesa}?</h2>
            <button type="button" className="cerrar" onClick={onCancelar}>✕</button>
          </div>

          <p className="ayuda">
            La cuenta todavia tiene {lineas.length} plato{lineas.length === 1 ? '' : 's'}. Si la
            liberas, se borran de la cuenta y la mesa queda vacia.
          </p>

          <div>
            <h3>Se borran</h3>
            {lineas.map((l) => (
              <div className="linea" key={l.id}>
                <span className="nombre">
                  {l.cantidad} x {l.plato}
                </span>
                <span className="precio">{plata(Number(l.precio) * l.cantidad)}</span>
              </div>
            ))}
            <div className="total">
              <span>Total</span>
              <span>{plata(total)}</span>
            </div>
          </div>

          <button type="button" className="boton-confirmar-peligro" onClick={onConfirmar}>
            Borrar platos y liberar
          </button>
          <button type="button" className="boton-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}