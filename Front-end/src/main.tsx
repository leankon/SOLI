import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { SesionProvider } from './context/SesionContext'
import { AvisoProvider } from './context/AvisoContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* toda la app puede leer quien entro y su token */}
    <SesionProvider>
      {/* y cualquier pantalla puede mostrar el aviso de error de abajo */}
      <AvisoProvider>
        <App />
      </AvisoProvider>
    </SesionProvider>
  </StrictMode>,
)