import { useState, useEffect } from 'react'
import type { Solicitud, Mesa } from '../data/tipos'
import { API } from '../data/constantes'
import { useSesion } from '../context/SesionContext'
import { useAviso } from '../context/AvisoContext'
import Llamado from '../components/Llamados'

export default function PanelEncargado() {
  // quien esta adentro y los headers con su token
  const { usuario, cabeceras } = useSesion()
  const { avisar } = useAviso()
  // hasta que el back lea el id del token lo sigo mandando en el body
  const idUsuario = usuario === null ? 0 : usuario.id

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [listaMesas, setListaMesas] = useState<Mesa[]>([])
  const [cargando, setCargando] = useState(true)

  // en modo claro esta pantalla va con la paleta arena del figma.
  // al irme a otra pantalla se la saco
  useEffect(() => {
    document.body.classList.add('arena')
    return () => document.body.classList.remove('arena')
  }, [])

  // los llamados que ya toque con ✓. el reloj puede traer una lista vieja,
  // de antes de que se guarde, y sin esto el llamado vuelve a aparecer
  const [apagados, setApagados] = useState<number[]>([])

  useEffect(() => {
    function traer() {
      // pido las dos cosas de una. necesito las mesas porque la solicitud
      // guarda el id de la mesa y yo tengo que mostrar el numero
      Promise.all([
        fetch(API + '/solicitudes', { headers: cabeceras() }).then((r) => r.json()),
        fetch(API + '/mesas', { headers: cabeceras() }).then((r) => r.json()),
      ]).then(([datosSolicitudes, datosMesas]) => {
        setSolicitudes(datosSolicitudes)
        setListaMesas(datosMesas)
        setCargando(false)
      })
    }

    // una vez al entrar, para no esperar tres segundos mirando el cartel
    traer()

    // y despues cada tres segundos: asi aparecen los llamados nuevos solos
    const reloj = setInterval(traer, 1000 )

    // cuando el encargado se va a otra pantalla apago el reloj. si no,
    // sigue preguntando para siempre aunque ya nadie este mirando
    return () => clearInterval(reloj)
  }, [])

  // las atendidas quedan en la base con otro estado, no se borran
  const pendientes = solicitudes.filter(
    (s) => s.estado === 'pendiente' && !apagados.includes(s.id)
  )

  // los de prioridad arriba de todo. entre los que empatan, sort deja el
  // orden de llegada, asi el resto sigue del mas viejo al mas nuevo
  const ordenados = [...pendientes].sort((a, b) => (b.prioridad ? 1 : 0) - (a.prioridad ? 1 : 0))

  function numeroDeMesa(idMesa: number) {
    const mesa = listaMesas.find((m) => m.id === idMesa)
    // si borraron la mesa y quedo la solicitud, muestro el id para no mentir
    return mesa === undefined ? idMesa : mesa.numero
  }

  const atender = async (id: number) => {
    // la saco de la pantalla ya, sin esperar la respuesta
    setApagados((lista) => [...lista, id])

    try {
      const response = await fetch(API + '/solicitudes/' + id, {
        method: 'PUT',
        headers: cabeceras(),
        // no se borra: queda guardada como atendida
        body: JSON.stringify({ estado: 'atendida', id_usuario: idUsuario }),
      })

      if (!response.ok) {
        throw new Error('Error al atender el llamado')
      }
    } catch (error) {
      console.error('Hubo un error:', error)
      // vuelvo atras: si no se guardo, la mesa sigue esperando
      setApagados((lista) => lista.filter((x) => x !== id))
      avisar('No se pudo apagar el llamado', 'Fijate la conexion.')
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
    <div className="panel-encargado">
      <div className="titulo-llamados">
        <h1>Llamados</h1>
        {pendientes.length > 0 && (
          <span className="cantidad">{pendientes.length} pendientes</span>
        )}
      </div>
      <p className="subtitulo">
        Los de prioridad van arriba de todo. El resto, del mas viejo al mas nuevo. Con ✓ el llamado se apaga para todos.
      </p>

      <div className="lista-llamados">
        {pendientes.length === 0 ? (
          <p className="sin-llamados">No hay llamados. Todo tranquilo.</p>
        ) : (
          ordenados.map((solicitud) => (
            <Llamado
              key={solicitud.id}
              solicitud={solicitud}
              numeroMesa={numeroDeMesa(solicitud.id_mesa)}
              onAtender={atender}
              prioridad={solicitud.prioridad}
            />
          ))
        )}
      </div>
    </div>
  )
}