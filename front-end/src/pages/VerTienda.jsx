import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VistaTienda = ({ agregarAlCarrito }) => {
    const { id } = useParams(); // Obtenemos el ID de la empresa de la URL
    const [empresa, setEmpresa] = useState(null);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hacemos una SOLA petición porque tu controlador ya devuelve todo junto
                const response = await axios.get(`http://127.0.0.1:8000/api/cliente/empresa/${id}/productos`);

                // Extraemos los datos del objeto que devuelve el controlador
                setEmpresa(response.data.empresa);
                setProductos(response.data.productos);
                setCategorias(response.data.categorias);

            } catch (error) {
                console.error("Error cargando la tienda", error);
            }
        };
        fetchData();
    }, [id]);

    // Lógica de filtrado en tiempo real
    const productosFiltrados = productos.filter(prod => {
        const coincideNombre = prod.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideCat = categoriaSeleccionada === 'todas' || prod.categoria_id == categoriaSeleccionada;
        return coincideNombre && coincideCat;
    });

    return (
        <div style={styles.container}>
            {/* CABECERA DE LA TIENDA */}
            {empresa && (
                <div style={styles.shopHeader}>
                    <img
                        src={`http://127.0.0.1:8000/storage/${empresa.logo}`}
                        style={styles.shopLogo}
                        alt={empresa.nombre}
                    />
                    <div>
                        <h1 style={{ margin: 0 }}>{empresa.nombre}</h1>
                        <p style={{ color: '#666' }}>Sede Oficial - Menú Digital</p>
                    </div>
                </div>
            )} {/* <--- Aquí estaba el error, faltaba cerrar el paréntesis antes de seguir */}

            {/* Buscador y Filtros */}
            <div style={styles.filterBar}>
                <input
                    type="text"
                    placeholder="🔍 Buscar producto..."
                    style={styles.searchInput}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                />
                <select
                    style={styles.select}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                >
                    <option value="todas">Todas las categorías</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
            </div>

            {/* Grid de Productos */}
            <div style={styles.grid}>
                {productosFiltrados.map(prod => (
                    <div key={prod.id} style={styles.card}>
                        {/* Verificación de imagen por si acaso el producto no tiene */}
                        <img
                            src={prod.imagen ? `http://127.0.0.1:8000/storage/${prod.imagen}` : 'https://via.placeholder.com/150'}
                            alt={prod.nombre}
                            style={styles.img}
                        />
                        <div style={styles.info}>
                            <h3 style={styles.prodName}>{prod.nombre}</h3>
                            <p style={styles.desc}>{prod.descripcion}</p>
                            <div style={styles.footerCard}>
                                <span style={styles.price}>${Number(prod.precio).toLocaleString()}</span>
                                <button style={styles.addBtn} onClick={() => agregarAlCarrito(prod)}>
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {productosFiltrados.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '50px' }}>No se encontraron productos con esos filtros.</p>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
    filterBar: { display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' },
    searchInput: { flex: 2, padding: '12px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', fontSize: '16px' },
    select: { flex: 1, padding: '12px', borderRadius: '25px', border: '1px solid #ddd', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    card: { background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s' },
    img: { width: '100%', height: '180px', objectFit: 'cover' },
    info: { padding: '15px' },
    prodName: { margin: '0 0 5px 0', fontSize: '18px' },
    desc: { color: '#777', fontSize: '14px', height: '40px', overflow: 'hidden' },
    footerCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' },
    price: { fontWeight: 'bold', fontSize: '18px', color: '#2ecc71' },
    addBtn: { background: '#1a1a1a', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }
};

export default VistaTienda;