import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import './App.css'
import Layout from './componentes/layout/Layout'
import Dashboard from './paginas/Dashboard'
import Dispositivos from './paginas/Dispositivos'
import Historico from './paginas/Historico'
import Usuarios from './paginas/Usuarios'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {

  const [dispositivos, setDispositivos] = useState([]);

  useEffect(() => {
    getDispositivos();
  }, []);

  async function getDispositivos() {
    const { data, error } = await supabase.from('dispositivos').select();  
    if (error) {
      console.error(error);
      return;
    }
    setDispositivos(data);
    
  }

  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    getCameras();
  }, []);

  async function getCameras() {
    const { data, error } = await supabase.from('camera').select();  
    if (error) {
      console.error(error);
      return;
    }
    setCameras(data);
    
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dispositivos" element={<Dispositivos />} />
          <Route path="historico" element={<Historico />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
