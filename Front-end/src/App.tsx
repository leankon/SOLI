import { useState } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import LoginMozo from './pages/LoginMozo'
import VistaMozo from './pages/VistaMozo'
import PanelEncargado from './pages/PanelEncargado'
import EditorPlano from './pages/EditorPlano'
import Catalogo from './pages/Catalogo'
import Simulador from './pages/Simulador'
import Nav from './components/Nav'

export default function App() {
  const [rol, setRol] = useState('')

  const login = <Login setRol={setRol} />

  function soloPara(necesita: string, pagina: ReactNode) {
    if (rol === '') return login
    if (rol !== necesita) return <p>Esta pantalla no es para tu rol.</p>
    return pagina
  }

  return (
    <BrowserRouter>
      <Nav rol={rol} onSalir={() => setRol('')} />
      <Routes>
        <Route path="/" element={login} />
        <Route path="/login" element={login} />
        <Route path="/login-mozo" element={<LoginMozo setRol={setRol} />} />

        <Route path="/mozo" element={soloPara('mozo', <VistaMozo />)} />
        <Route path="/encargado" element={soloPara('encargado', <PanelEncargado />)} />
        <Route path="/plano" element={soloPara('encargado', <EditorPlano />)} />
        <Route path="/catalogo" element={soloPara('encargado', <Catalogo />)} />

        <Route path="/simulador" element={<Simulador />} />
      </Routes>
    </BrowserRouter>
  )
}