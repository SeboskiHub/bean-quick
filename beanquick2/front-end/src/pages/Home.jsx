import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>¡Bienvenido a la Plataforma de Autenticación!</h1>
      <p>Esta aplicación utiliza React y una API RESTful de Laravel con Sanctum para manejar la autenticación de usuarios.</p>

      <div style={{ marginTop: '30px' }}>
        <p>¿Eres nuevo? Regístrate:</p>
        <Link 
          to="/register" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px', 
            marginRight: '15px' 
          }}
        >
          Ir a Registro
        </Link>
        
        <p style={{ marginTop: '20px' }}>¿Ya tienes cuenta? Inicia sesión:</p>
        <Link 
          to="/login" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px' 
          }}
        >
          Ir a Login
        </Link>
      </div>
    </div>
  );
};

export default Home;