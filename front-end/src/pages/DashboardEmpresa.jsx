import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// Importamos iconos para que se vea más profesional
import { FaBoxOpen, FaPlusCircle, FaCheckCircle, FaClipboardList } from 'react-icons/fa';

const DashboardEmpresa = () => {
    const navigate = useNavigate();
    const [empresa, setEmpresa] = useState(null);
    const [stats, setStats] = useState({ pendientes: 0 }); // Para mostrar cuántos pedidos hay
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('AUTH_TOKEN');
        if (!token) { navigate('/login'); return; }

        const fetchEmpresaData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/empresa/perfil', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.data.empresa) {
                    setEmpresa(response.data.empresa);
                    // Opcional: Podrías llamar a otra API aquí para contar los pedidos pendientes
                    // setStats({ pendientes: response.data.pendientes_count });
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmpresaData();
    }, [navigate]);

    if (loading) return <p>Cargando panel...</p>;

    return (
        <div style={styles.dashboard}>
            <aside style={styles.sidebar}>
                <h2 style={{color: 'white', marginBottom: '30px'}}>Panel Empresa</h2>
                <nav>
                    <ul style={{listStyle: 'none', padding: 0}}>
                        <li style={styles.navItem}><Link to="/empresa/panel" style={styles.linkText}>Inicio</Link></li>
                        <li style={styles.navItem}><Link to="/empresa/pedidos" style={styles.linkText}>Gestionar Pedidos</Link></li>
                        <li style={styles.navItem}><Link to="/empresa/productos" style={styles.linkText}>Mis Productos</Link></li>
                        <li style={{...styles.navItem, marginTop: '50px', color: '#ff4d4d'}} onClick={() => { localStorage.clear(); navigate('/login'); }}>Cerrar Sesión</li>
                    </ul>
                </nav>
            </aside>

            <main style={styles.main}>
                <div style={styles.header}>
                    {empresa?.logo && (
                        <img 
                            src={`http://127.0.0.1:8000/storage/${empresa.logo}`} 
                            alt="Logo" 
                            style={styles.logoImg}
                        />
                    )}
                    <div>
                        <h1 style={{margin: 0}}>{empresa?.nombre_establecimiento || empresa?.nombre}</h1>
                        <p style={{color: '#666', margin: 0}}>NIT: {empresa?.nit}</p>
                    </div>
                </div>

                <div style={styles.grid}>
                    {/* TARJETA 1: ESTADO */}
                    <div style={styles.card}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <h3>Estado</h3>
                            <FaCheckCircle color="green" size={24} />
                        </div>
                        <p style={{color: 'green', fontWeight: 'bold', fontSize: '18px'}}>Tienda Activa</p>
                        <p style={{fontSize: '12px', color: '#888'}}>Visible para los clientes</p>
                    </div>

                    {/* TARJETA 2: VER PEDIDOS (La que pediste) */}
                    <Link to="/empresa/pedidos" style={{ textDecoration: 'none', flex: 1 }}>
                        <div style={{ ...styles.card, ...styles.cardAction }}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <h3 style={{color: '#333'}}>Ver Pedidos</h3>
                                <FaClipboardList color="#6f4e37" size={24} />
                            </div>
                            <p style={{ color: '#666', fontSize: '14px' }}>Gestiona las órdenes entrantes y cambia sus estados.</p>
                            <div style={styles.verMas}>Ir a pedidos →</div>
                        </div>
                    </Link>

                    {/* TARJETA 3: AGREGAR PRODUCTO */}
                    <Link to="/empresa/productos/nuevo" style={{ textDecoration: 'none', flex: 1 }}>
                        <div style={{ ...styles.card, ...styles.cardAction }}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <h3 style={{color: '#333'}}>Nuevo Producto</h3>
                                <FaPlusCircle color="#6f4e37" size={24} />
                            </div>
                            <p style={{ color: '#666', fontSize: '14px' }}>Sube nuevas opciones a tu menú digital.</p>
                            <div style={styles.verMas}>Agregar ahora →</div>
                        </div>
                    </Link>
                </div> 
            </main>
        </div>
    );
};

const styles = {
    dashboard: { display: 'flex', minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Arial, sans-serif' },
    sidebar: { width: '250px', background: '#1a1a1a', padding: '20px' },
    navItem: { padding: '15px 0', borderBottom: '1px solid #333' },
    linkText: { color: '#ccc', textDecoration: 'none', display: 'block', width: '100%' },
    main: { flex: 1, padding: '40px' },
    header: { display: 'flex', alignItems: 'center', gap: '20px', background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' },
    logoImg: { width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f0f0f0' },
    grid: { display: 'flex', gap: '25px', flexWrap: 'wrap' },
    card: { 
        background: 'white', 
        padding: '25px', 
        borderRadius: '15px', 
        flex: '1 1 300px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    cardAction: { 
        cursor: 'pointer', 
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid transparent'
    },
    // Efecto simple de hover se puede hacer con CSS o inline
    verMas: { color: '#6f4e37', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }
};

export default DashboardEmpresa;