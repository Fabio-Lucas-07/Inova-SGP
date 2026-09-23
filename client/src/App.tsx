import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Route ,BrowserRouter,Routes  } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Navbar from './components/Navbar.tsx'
import Login from './pages/Login.tsx'
import Prontuários from './pages/Prontuários.tsx'
import Clientes from './pages/Clientes.tsx'
import Financeiro from './pages/Financeiro.tsx'
import  Layout  from './components/Layout.tsx'
import Calendario from './components/calendario/Calendario.tsx'
import Testes from './pages/Testes.tsx'



function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login/>}/> */}
        
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/clientes" element={<Clientes/>}/>
          <Route path="/prontuarios" element={<Prontuários/>}/>
          <Route path="/financeiro" element={<Financeiro/>}/>
        </Route>
        <Route path='/teste' element={<Calendario/>}></Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
