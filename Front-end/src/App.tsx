import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import VistaMozo from './pages/VistaMozo'
import PanelEncargado from './pages/PanelEncargado'
import EditorPlano from './pages/EditorPlano'
import Catalogo from './pages/Catalogo'
import CrearRol from './pages/CrearRol'
import Simulador from './pages/Simulador'
import Nav from './components/Nav'
import { useSesion } from './context/SesionContext'

export default function App() {
  // quien entro vive en el context: aca solo lo leo para saber que
  // pantallas puede ver
  const { usuario, salir } = useSesion()

  // el rol sale del usuario. si lo guardara aparte tendria el mismo dato en dos
  // lugares y tarde o temprano uno de los dos queda viejo
  const rol = usuario === null ? '' : usuario.rol

  const login = <Login />

  function soloPara(necesita: string, pagina: ReactNode) {
    if (rol === '') return login
    if (rol !== necesita) return <p>Esta pantalla no es para tu rol.</p>
    return pagina
  }

  return (
    <BrowserRouter>
      <Nav rol={rol} onSalir={salir} />
      <Routes>
        <Route path="/" element={login} />
        <Route path="/login" element={login} />
        <Route path="/mozo" element={soloPara('mozo', <VistaMozo />)} />
        <Route path="/encargado" element={soloPara('encargado', <PanelEncargado />)} />
        <Route path="/plano" element={soloPara('encargado', <EditorPlano />)} />
        <Route path="/catalogo" element={soloPara('encargado', <Catalogo />)} />
        <Route path="/crear-rol" element={soloPara('encargado', <CrearRol />)} />

        <Route path="/simulador" element={<Simulador />} />

        {/* el * agarra cualquier direccion que no exista. sin esto la pantalla
            queda en blanco y parece que se rompio algo */}
        <Route path="*" element={<p>Esta pantalla no existe.</p>} />
      </Routes>
    </BrowserRouter>
  )
}