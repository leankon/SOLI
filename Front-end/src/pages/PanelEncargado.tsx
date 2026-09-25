import { useState, useEffect } from 'react'
import type { Solicitud, Mesa } from '../data/tipos'
import { API } from '../data/constantes'
import Llamado from '../components/Llamados'

export default function PanelEncargado() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [listaMesas, setListaMesas] = useState<Mesa[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    function traer() {
      // pido las dos cosas de una. necesito las mesas porque la solicitud
      // guarda el id de la mesa y yo tengo que mostrar el numero
      Promise.all([
        fetch(API + '/solicitudes').then((r) => r.json()),
        fetch(API + '/mesas').then((r) => r.json()),
      ]).then(([datosSolicitudes, datosMesas]) => {
        setSolicitudes(datosSolicitudes)
        setListaMesas(datosMesas)
        setCargando(false)
      })
    }

    // una vez al entrar, para no esperar tres segundos mirando el cartel
    traer()

    // y despues cada tres segundos: asi aparecen los llamados nuevos solos
    const reloj = setInterval(traer, 3000)

    // cuando el encargado se va a otra pantalla apago el reloj. si no,
    // sigue preguntando para siempre aunque ya nadie este mirando
    return () => clearInterval(reloj)
  }, [])

  // las atendidas quedan en la base con otro estado, no se borran
  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente')

  function numeroDeMesa(idMesa: number) {
    const mesa = listaMesas.find((m) => m.id === idMesa)
    // si borraron la mesa y quedo la solicitud, muestro el id para no mentir
    return mesa === undefined ? idMesa : mesa.numero
  }

  function atender(id: number) {
    // por ahora solo la saco de la pantalla. para que quede atendida en la
    // base hace falta un PUT que le cambie el estado
    setSolicitudes(solicitudes.filter((s) => s.id !== id))
  }

  if (cargando) {
    return (
      <div>
        <h1>Llamados</h1>
        <p>Buscando los llamados...</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Llamados ({pendientes.length})</h1>

      {pendientes.length === 0 ? (
        <p>No hay llamados. Todo tranquilo.</p>
      ) : (
        <div>
          {pendientes.map((solicitud) => (
            <Llamado
              key={solicitud.id}
              solicitud={solicitud}
              numeroMesa={numeroDeMesa(solicitud.id_mesa)}
              onAtender={atender}
            />
          ))}
        </div>
      )}
    </div>
  )
}