import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import VistaMozo from './pages/VistaMozo'
import PanelEncargado from './pages/PanelEncargado'
import EditorPlano from './pages/EditorPlano'
import Catalogo from './pages/Catalogo'
import Simulador from './pages/Simulador'
import BarraDev from './components/BarraDev'
export default function App() {
  return (
    <BrowserRouter>
      <BarraDev />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mozo" element={<VistaMozo />} />
        <Route path="/encargado" element={<PanelEncargado />} />
        <Route path="/plano" element={<EditorPlano />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/simulador" element={<Simulador />} />
      </Routes>
    </BrowserRouter>
  )
}