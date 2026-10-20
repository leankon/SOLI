import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Usuario } from '../data/tipos'

// lo que cualquier pantalla puede pedir de la sesion
type Sesion = {
  usuario: Usuario | null
  entrar: (usuario: Usuario, token: string) => void
  salir: () => void
  // los headers de cada fetch, ya con el token adentro
  cabeceras: () => Record<string, string>
}

const SesionContext = createContext<Sesion | null>(null)

// envuelve toda la app en main.tsx. adentro vive quien entro y su token
export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  // la pulsera que da el login. el back la pide en cada consulta para
  // saber quien pregunta, asi no hace falta mandar el id en el body
  const [token, setToken] = useState('')

  function entrar(nuevo: Usuario, nuevoToken: string) {
    setUsuario(nuevo)
    setToken(nuevoToken)
  }

  function salir() {
    setUsuario(null)
    setToken('')
  }

  function cabeceras() {
    return {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    }
  }

  return (
    <SesionContext.Provider value={{ usuario, entrar, salir, cabeceras }}>
      {children}
    </SesionContext.Provider>
  )
}

// cada pantalla la usa asi: const { usuario, cabeceras } = useSesion()
export function useSesion() {
  const sesion = useContext(SesionContext)
  // si alguien la usa afuera del provider prefiero que explote ya y no
  // que ande a medias con datos vacios
  if (sesion === null) {
    throw new Error('useSesion tiene que usarse adentro de SesionProvider')
  }
  return sesion
}