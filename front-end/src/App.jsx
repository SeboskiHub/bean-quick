import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

// ... (tus importaciones de páginas se mantienen igual)
import Register from './pages/Register'; 
import Login from './pages/Login'; 
import Home from './pages/Home';
import RegistroEmpresa from './pages/RegistroEmpresa'; 
import DashboardCliente from './pages/DashboardCliente';
import DashboardEmpresa from './pages/DashboardEmpresa';
import AgregarProducto from './pages/AgregarProducto';
import MisProductos from './pages/MisProductos';
import VistaTienda from './pages/VerTienda';
import CarritoFlotante from './pages/CarritoFlotante';
import ActivarCuenta from './pages/ActivarCuenta';
import AdminDashboard from './pages/AdminDashboard';
import AdminSolicitudes from './pages/AdminSolicitudes';
import MisPedidos from './pages/MisPedidos';
import GestionPedidosEmpresa from './pages/GestionPedidosEmpresa'
import './App.css';

// --- COMPONENTE HEADER --- (Se mantiene igual)
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAuthenticated = !!localStorage.getItem('AUTH_TOKEN');
    const userRole = localStorage.getItem('USER_ROLE');
    const toggleMenu = () => { setIsMenuOpen(!isMenuOpen); };
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <nav className='nav'>
            <div className="container nav_items">
                <div className="tittle">
                    <Link to='/' className='item-tittle' onClick={() => setIsMenuOpen(false)}>
                        <h1>Bean <span>Quick</span></h1>
                    </Link>
                </div>
                <div className="nav-right-section" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className="menu-toggle" onClick={toggleMenu}>
                        {isMenuOpen ? '✕' : '☰'} 
                    </button>
                </div>
                <div className={`nav-links-wrapper ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className='link' onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className='link' onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link to="/register" className='link' onClick={() => setIsMenuOpen(false)}>Registro</Link>
                        </>
                    ) : (
                        <>
                            {userRole === 'admin' && (
                                <Link to="/admin/dashboard" className='link' style={{color: '#6f4e37', fontWeight: 'bold'}} onClick={() => setIsMenuOpen(false)}>Panel Admin</Link>
                            )}
                            {userRole === 'cliente' && (
                                <>
                                    <Link to="/cliente/dashboard" className='link' onClick={() => setIsMenuOpen(false)}>Tiendas</Link>
                                    <Link to="/solicitud-empresa" className='link' style={{color: '#ffcc00', fontWeight: 'bold'}} onClick={() => setIsMenuOpen(false)}>Registrar mi Empresa</Link>
                                    <Link to="/cliente/mis-pedidos" className='link' onClick={() => setIsMenuOpen(false)}>Mis Pedidos</Link>
                                </>
                            )}
                            {userRole === 'empresa' && (
                                <Link to="/empresa/panel" className='link' onClick={() => setIsMenuOpen(false)}>Panel de mi Cafetería</Link>
                            )}
                            <button onClick={handleLogout} className='link logout-btn' style={{background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: '0', fontSize: 'inherit'}}>
                                Cerrar Sesión
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

// --- COMPONENTE WRAPPER ---
// Añadimos eliminarDelCarrito a las props
const AppLayout = ({ carrito, setCarrito, agregarAlCarrito, confirmarPedido, actualizarCantidad, eliminarDelCarrito }) => {
    const location = useLocation();
    const userRole = localStorage.getItem('USER_ROLE');
    
    const isEmpresa = location.pathname.startsWith('/empresa');
    const isAdmin = location.pathname.startsWith('/admin');
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    
    const hideHeader = isEmpresa || isAdmin;

    return (
        <>
            {!hideHeader && <Header />} 

            {!isEmpresa && !isAdmin && !isAuthPage && userRole === 'cliente' && (
                <CarritoFlotante 
                    carrito={carrito} 
                    setCarrito={setCarrito} 
                    confirmarPedido={confirmarPedido} 
                    actualizarCantidad={actualizarCantidad}
                    eliminarDelCarrito={eliminarDelCarrito} // <--- Pasamos la función
                />
            )}

            <main className={hideHeader ? '' : 'main-content'}>
                <div className={hideHeader ? '' : 'content-wrapper'}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/empresa/activar/:token" element={<ActivarCuenta />}/>
                        <Route path="/solicitud-empresa" element={<RegistroEmpresa />} />
                        <Route path="/cliente/dashboard" element={<DashboardCliente />} />
                        <Route path="/tienda/:id" element={<VistaTienda agregarAlCarrito={agregarAlCarrito} />} />
                        <Route path="/cliente/mis-pedidos" element={<MisPedidos />} />
                        <Route path="/empresa/panel" element={<DashboardEmpresa />} />
                        <Route path="/empresa/productos/nuevo" element={<AgregarProducto />} />
                        <Route path="/empresa/productos" element={<MisProductos />} />
                        <Route path="/empresa/productos/editar/:id" element={<AgregarProducto />} />
                        <Route path="/empresa/pedidos" element={<GestionPedidosEmpresa />} />
                        <Route path="/admin/dashboard" element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
                        <Route path="/admin/solicitudes" element={userRole === 'admin' ? <AdminSolicitudes /> : <Navigate to="/login" />} />
                        <Route path="*" element={<div style={{textAlign: 'center', marginTop: '50px'}}><h1>404</h1><Link to="/">Volver</Link></div>} />
                    </Routes>
                </div>
            </main>
        </>
    );
};

// --- COMPONENTE PRINCIPAL APP ---
function App() {
    // App.jsx

const [carrito, setCarrito] = useState([]);

// 1. Efecto para cargar el carrito de la BD al iniciar la app
useEffect(() => {
    fetchCarrito();
}, []); // Los corchetes vacíos hacen que solo corra una vez al cargar

const fetchCarrito = async () => {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) return; // Si no hay sesión, no buscamos carrito

    try {
        const res = await axios.get('http://127.0.0.1:8000/api/cliente/carrito', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Seteamos el carrito con lo que viene de Laravel (que ya incluye empresas)
        setCarrito(res.data); 
    } catch (error) {
        console.error("Error al cargar carrito inicial", error);
    }
};

    // 2. AGREGAR
    const agregarAlCarrito = async (producto, cantidad = 1) => {
        const token = localStorage.getItem('AUTH_TOKEN');
        if (!token) { alert("Debes iniciar sesión para agregar productos"); return; }
        try {
            const res = await axios.post(
                `http://127.0.0.1:8000/api/cliente/carrito/agregar/${producto.id}`, 
                { cantidad: cantidad },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data && res.data.productos) {
                const productosActualizados = res.data.productos.map(p => ({
                    ...p,
                    cantidad: p.pivot ? p.pivot.cantidad : 1
                }));
                setCarrito(productosActualizados);
            }
        } catch (error) {
            console.error("Error al agregar producto", error);
        }
    };

    // 3. ACTUALIZAR CANTIDAD
    const actualizarCantidad = async (productoId, nuevaCantidad) => {
        if (nuevaCantidad < 1) return eliminarDelCarrito(productoId); // Si baja de 1, eliminar

        const token = localStorage.getItem('AUTH_TOKEN');
        try {
            const res = await axios.put(
                `http://127.0.0.1:8000/api/cliente/carrito/actualizar/${productoId}`, 
                { cantidad: nuevaCantidad },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (res.data && res.data.productos) {
                const productosActualizados = res.data.productos.map(p => ({
                    ...p,
                    cantidad: p.pivot ? p.pivot.cantidad : 1
                }));
                setCarrito(productosActualizados);
            }
        } catch (error) {
            console.error("Error al actualizar carrito", error);
        }
    };

    // 4. NUEVA FUNCIÓN: ELIMINAR TOTALMENTE UN PRODUCTO
    const eliminarDelCarrito = async (productoId) => {
        const token = localStorage.getItem('AUTH_TOKEN');
        try {
            // Ajusta esta URL a la de tu API de Laravel para eliminar
            await axios.delete(`http://127.0.0.1:8000/api/cliente/carrito/eliminar/${productoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Filtramos localmente para quitarlo de la vista de inmediato
            setCarrito(prev => prev.filter(p => p.id !== productoId));
        } catch (error) {
            console.error("Error al eliminar del carrito", error);
        }
    };

    // 5. CONFIRMAR PEDIDO
    const confirmarPedido = async (direccion = "Entrega en Local", horaRecogida, empresaId, productosTienda) => {
        const token = localStorage.getItem('AUTH_TOKEN');
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/cliente/pedidos`, 
                { 
                    direccion, 
                    hora_recogida: horaRecogida,
                    empresa_id: empresaId,
                    items: productosTienda 
                }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 || response.status === 201) {
                alert("¡Pedido realizado con éxito!");
                setCarrito(prevCarrito => prevCarrito.filter(item => item.empresa_id != empresaId));
                return true; 
            }
        } catch (error) {
            console.error("Error al confirmar pedido", error);
            alert(error.response?.data?.message || "Error al procesar el pedido");
            return false;
        }
    };

    return (
        <BrowserRouter>
            <AppLayout 
                carrito={carrito} 
                setCarrito={setCarrito} 
                agregarAlCarrito={agregarAlCarrito} 
                confirmarPedido={confirmarPedido}
                actualizarCantidad={actualizarCantidad}
                eliminarDelCarrito={eliminarDelCarrito} // <--- Pasamos la nueva función
            />
        </BrowserRouter>
    );
}

export default App;