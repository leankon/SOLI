import { mesas } from '../data/mesas'
import Mesa from '../components/Mesa'
export default function VistaMozo() {
  return (
    <div>
      <h1>Vista mozo</h1>


      <div className="plano">
        {mesas.map((mesa) => <Mesa key={mesa.id} mesa={mesa} />)}
      </div>
    </div>
  )
}
