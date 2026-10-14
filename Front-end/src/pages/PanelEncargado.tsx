import { useState, useEffect } from 'react'
import type { Solicitud, Mesa } from '../data/tipos'
import { API } from '../data/constantes'
import Llamado from '../components/Llamados'

type Props = {
  // quien apaga el llamado. viaja en el PUT
  idUsuario: number
}

export default function PanelEncargado({ idUsuario }: Props) {
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

  const atender = async (id: number) => {
    const antes = solicitudes

    // la saco de la pantalla ya, sin esperar la respuesta
    setSolicitudes(solicitudes.map((s) => (s.id === id ? { ...s, estado: 'atendida' } : s)))

    try {
      const response = await fetch(API + '/solicitudes/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // no se borra: queda guardada como atendida
        body: JSON.stringify({ estado: 'atendida', id_usuario: idUsuario }),
      })

      if (!response.ok) {
        throw new Error('Error al atender el llamado')
      }
    } catch (error) {
      console.error('Hubo un error:', error)
      // vuelvo atras: si no se guardo, la mesa sigue esperando
      setSolicitudes(antes)
      alert('No se pudo apagar el llamado. Fijate la conexion.')
    }
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