import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register'; // Asegúrate de crear este archivo
import Login from './pages/Login';       // Asegúrate de crear este archivo
import Home from './pages/Home';         // Componente de inicio simple

// --- Componente de Navegación (Header) ---
// Este componente contendrá los links que se muestran en todas las páginas.
const Header = () => {
  return (
    <nav style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white' }}>
      <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
        Inicio
      </Link>
      <Link to="/login" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
        Login
      </Link>
      <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
        Registro
      </Link>
    </nav>
  );
};

// --- Componente Principal de la Aplicación ---
function App() {
  return (
    // 1. BrowserRouter debe envolver toda la aplicación
    <BrowserRouter>
      {/* El Header se renderiza en TODAS las rutas */}
      <Header /> 
      
      <main style={{ padding: '20px' }}>
        {/* 2. Routes define las áreas donde se cargarán los componentes de ruta */}
        <Routes>
          {/* Ruta de Inicio (la página principal) */}
          <Route path="/" element={<Home />} />
          
          {/* Ruta de Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta de Registro */}
          <Route path="/register" element={<Register />} />
          
          {/* Ruta 404 (opcional) */}
          <Route path="*" element={<h1>404: Página no encontrada</h1>} />
        </Routes>
      </main>
      
    </BrowserRouter>
  );
}

export default App;