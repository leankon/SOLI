import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { SesionProvider } from './context/SesionContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* toda la app puede leer quien entro y su token */}
    <SesionProvider>
      <App />
    </SesionProvider>
  </StrictMode>,
)