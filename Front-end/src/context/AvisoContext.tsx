import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

// el aviso de abajo cuando algo sale mal, como el del figma.
// reemplaza a los alert, que frenan toda la pagina y quedan feos
type Aviso = {
  titulo: string
  detalle: string
}

type Avisos = {
  avisar: (titulo: string, detalle: string) => void
}

const AvisoContext = createContext<Avisos | null>(null)

// envuelve toda la app en main.tsx, igual que la sesion
export function AvisoProvider({ children }: { children: ReactNode }) {
  // null es que no hay ningun aviso en pantalla
  const [aviso, setAviso] = useState<Aviso | null>(null)

  function avisar(titulo: string, detalle: string) {
    setAviso({ titulo, detalle })
  }

  return (
    <AvisoContext.Provider value={{ avisar }}>
      {children}

      {aviso !== null && (
        <div className="aviso-error" role="alert">
          <div>
            <p className="aviso-error-titulo">{aviso.titulo}</p>
            <p className="aviso-error-detalle">{aviso.detalle}</p>
          </div>
          <button type="button" onClick={() => setAviso(null)}>
            Entendido
          </button>
        </div>
      )}
    </AvisoContext.Provider>
  )
}

// cada pantalla la usa asi: const { avisar } = useAviso()
export function useAviso() {
  const avisos = useContext(AvisoContext)
  if (avisos === null) {
    throw new Error('useAviso tiene que usarse adentro de AvisoProvider')
  }
  return avisos
}