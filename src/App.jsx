import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import ProjectsPage from './pages/Projects'
import Contact from './pages/Contact'
import Skills from './pages/Skills'
import About from './pages/About'
import Footer from './components/Footer'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer contact="Email: 24aiml073@charusat.edu.in" />
      </div>
    </BrowserRouter>
  )
}

export default App
