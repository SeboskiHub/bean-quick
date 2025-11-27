import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Configura la URL base de tu API de Laravel
const API_URL = 'http://127.0.0.1:8000/api'; 

const Register = () => {
    // 1. ESTADOS: Para guardar los datos del formulario y manejar errores
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '' // ¡CRUCIAL! Laravel requiere este nombre
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 2. MANEJO DE CAMBIOS: Actualiza el estado cuando el usuario escribe
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. MANEJO DEL ENVÍO: Lógica para enviar los datos a Laravel
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Petición POST a tu endpoint de Laravel /api/register
            const response = await axios.post(`${API_URL}/register`, formData);

            console.log('Registro Exitoso:', response.data);
            
            // Si el registro es exitoso, redirige al usuario al Login
            // para que pueda iniciar sesión inmediatamente.
            navigate('/login'); 

        } catch (err) {
            // Manejo de errores de validación de Laravel (código 422)
            if (err.response && err.response.status === 422) {
                const validationErrors = err.response.data.errors;
                let errorMessage = 'Error de validación: ';
                
                // Muestra solo el primer mensaje de error para simplicidad
                for (const key in validationErrors) {
                    errorMessage += validationErrors[key][0];
                    break;
                }
                setError(errorMessage);
            } else {
                // Maneja otros errores (ej. servidor caído, error 500)
                setError('Hubo un error de conexión o de servidor. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2>Registro de Usuario</h2>
            
            {/* Muestra errores */}
            {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Confirmar Contraseña:</label>
                    <input
                        type="password"
                        name="password_confirmation" // ¡Nombre crucial!
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;