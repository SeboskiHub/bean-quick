import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000/api'; 

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        rol: 'cliente' 
    });
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // 1. Sanitización y Bloqueo de caracteres peligrosos (< > etc)
        const dangerousChars = /[<>{}[\]\\/]/;
        if (dangerousChars.test(formData.name) || dangerousChars.test(formData.email)) {
            setErrors({ general: 'No se permiten caracteres especiales como < > { } [ ] por seguridad.' });
            return;
        }

        // 2. Validación de Contraseña Segura (Sincronizada con Laravel)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setErrors({ 
                password: ['La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.'] 
            });
            return;
        }

        // 3. Confirmación de contraseñas
        if (formData.password !== formData.password_confirmation) {
            setErrors({ password: ['Las contraseñas no coinciden.'] });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/register`, formData);
            
            // Ajustado al formato de respuesta del nuevo controlador
            const { token, user, redirectTo } = response.data;
            
            localStorage.setItem('AUTH_TOKEN', token);
            localStorage.setItem('USER_ROLE', user.rol);
            localStorage.setItem('USER_NAME', user.name);

            // Configuramos el header para futuras peticiones
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            console.log('Registro exitoso. Redirigiendo a:', redirectTo);
            navigate(redirectTo); 

        } catch (err) {
            if (err.response && err.response.status === 422) {
                // Errores de validación de Laravel (incluyendo 'uncompromised' password)
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: 'Hubo un error al conectar con el servidor.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container_form" style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2 className='text_center'>Crear Cuenta</h2>
            
            {/* Mensaje de error general (XSS o Conexión) */}
            {errors.general && (
                <p style={{ color: 'white', backgroundColor: '#d9534f', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                    {errors.general}
                </p>
            )}
            
            <form onSubmit={handleSubmit} className='form'>
                <div className='input__container'>
                    <label>Nombre Completo:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className='input' placeholder="Tu nombre" />
                    {errors.name && <small style={{color: 'red'}}>{errors.name[0]}</small>}
                </div>
                
                <div className='input__container'>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className='input' placeholder="correo@ejemplo.com" />
                    {errors.email && <small style={{color: 'red'}}>{errors.email[0]}</small>}
                </div>
                
                <div className='input__container'>
                    <label>Contraseña:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className='input' placeholder="Min. 8 caracteres, Mayús, Min y Núm" />
                    {errors.password && <small style={{color: 'red'}}>{errors.password[0]}</small>}
                </div>

                <div className='input__container'>
                    <label>Confirmar Contraseña:</label>
                    <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required className='input' placeholder="Repite tu contraseña" />
                </div>
                
                <button type="submit" className='btn-ini' disabled={loading} style={{ backgroundColor: loading ? '#ccc' : 'green', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Validando Seguridad...' : 'Finalizar Registro'}
                </button>
            </form>
        </div>
    );
};

export default Register;