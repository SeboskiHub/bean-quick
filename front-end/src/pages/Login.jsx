import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000/api'; 

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Estado para deshabilitar el botón mientras carga
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await axios.post(`${API_URL}/login`, formData);
        const { token, user, status } = response.data;

        if (status === 'success') {
            // 1. Guardamos todo en el LocalStorage
            localStorage.setItem('AUTH_TOKEN', token);
            localStorage.setItem('USER_ROLE', user.rol);
            localStorage.setItem('USER_NAME', user.name);

            // 2. Configuramos el token para futuras peticiones
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // --- AQUÍ FORZAMOS LA REDIRECCIÓN ---
            console.log("Redirigiendo según el rol:", user.rol);

            if (user.rol === 'cliente') {
                navigate('/cliente/dashboard');
            } else if (user.rol === 'empresa') {
                navigate('/empresa/panel');
            } else if (user.rol === 'admin') {
                navigate('/admin/dashboard');
            } else {
                // Si por alguna razón no tiene rol, lo mandamos al inicio
                navigate('/');
            }
            
            // Opcional: Recargar la página para que el Header detecte los cambios del LocalStorage inmediatamente
            window.location.reload();
        }
        } catch (err) {
            if (err.response) {
                // Errores que vienen de Laravel (401 credenciales, 422 validación)
                setError(err.response.data.message || 'Credenciales incorrectas');
            } else {
                setError('No se pudo conectar con el servidor');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='site-header'>
            <div className="container container__log">
                <div className="container_form">
                    {error && <p style={{ color: 'white', backgroundColor: '#d9534f', padding: '10px', borderRadius: '5px' }}>{error}</p>}
                    
                    <form onSubmit={handleSubmit} className='form item_container_form'>
                        <h2 className='text_center'>Iniciar Sesión</h2>
                        <div className='input__container'>
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className='input'
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                        
                        <div className='input__container'>
                            <label>Contraseña:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className='input'
                                placeholder="********"
                            />
                        </div>
                        
                        <button type="submit" className='btn-ini' disabled={loading}>
                            {loading ? 'Cargando...' : 'Entrar'}
                        </button>
                        <p className='forget_password'><a href="#!">¿Olvidaste tu contraseña?</a></p>
                    </form>

                    <div className="form_helper_text item_container_form">
                        <h2>¿Quieres registrar tu propia empresa?</h2>
                        <div className="card_info">
                            <p>Contáctanos</p>
                            <p>3016013816</p>
                            <a href="mailto:simon4445558@gmail.com">simon4445558@gmail.com</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;