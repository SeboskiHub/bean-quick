import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistroEmpresa = () => {
  const navigate = useNavigate();
  const estadoInicial = {
    nombre: '',
    correo: '',
    nit: '',
    telefono: '',
    direccion: '',
    descripcion: '',
    logo: null,
    foto_local: null
  };

  const [formData, setFormData] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (errores[name]) setErrores({ ...errores, [name]: null });

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});
    
    // 1. Sanitización básica de caracteres peligrosos
    const dangerousChars = /[<>{}[\]\\/]/;
    if (dangerousChars.test(formData.nombre) || dangerousChars.test(formData.descripcion)) {
        setErrores({ general: 'No se permiten caracteres especiales como < > { } [ ]' });
        return;
    }

    setLoading(true);

    // 2. Preparar FormData para envío de archivos
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      // 3. Envío con el TOKEN de AUTH_TOKEN
      const token = localStorage.getItem('AUTH_TOKEN');
      const response = await axios.post('http://127.0.0.1:8000/api/solicitud-empresa', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Crucial para que el backend sepa quién es el dueño
        }
      });
      // USAMOS la variable aquí para que el error de "never used" desaparezca
      console.log("Respuesta exitosa:", response.data);
      alert('¡Solicitud enviada con éxito! Espera la aprobación del administrador.');
      
      // Limpiar todo tras el éxito
      setFormData(estadoInicial);
      setResetKey(prev => prev + 1);
      navigate('/'); // Redirigir al inicio

    } catch (error) {
      if (error.response && error.response.status === 422) {
    setErrores(error.response.data.errors); // Aquí Laravel envía "errors", pero lo guardamos en "setErrores"
  } else {
    setErrores({ general: 'Hubo un error al enviar.' });
  }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg my-10 border-t-4 border-blue-600">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pb-2">Registrar mi Empresa</h2>
      
      {errores.general && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {errores.general}
          </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre de la Empresa *</label>
            <input 
              type="text" name="nombre" value={formData.nombre} onChange={handleChange}
              className={`w-full p-2 border rounded ${errores.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Ej: Café Aroma Central"
            />
            {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre[0]}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Correo Corporativo *</label>
            <input 
              type="email" name="correo" value={formData.correo} onChange={handleChange}
              className={`w-full p-2 border rounded ${errores.correo ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="empresa@correo.com"
            />
            {errores.correo && <p className="text-red-500 text-xs mt-1">{errores.correo[0]}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">NIT / Identificación</label>
            <input 
              type="text" name="nit" value={formData.nit} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Teléfono de Contacto *</label>
            <input 
              type="text" name="telefono" value={formData.telefono} onChange={handleChange}
              className={`w-full p-2 border rounded ${errores.telefono ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
            {errores.telefono && <p className="text-red-500 text-xs mt-1">{errores.telefono[0]}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Dirección Física *</label>
          <input 
            type="text" name="direccion" value={formData.direccion} onChange={handleChange}
            className={`w-full p-2 border rounded ${errores.direccion ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
          {errores.direccion && <p className="text-red-500 text-xs mt-1">{errores.direccion[0]}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Descripción de la Empresa *</label>
          <textarea 
            name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange}
            placeholder="Describe brevemente tu cafetería..."
            className={`w-full p-2 border rounded ${errores.descripcion ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
          {errores.descripcion && <p className="text-red-500 text-xs mt-1">{errores.descripcion[0]}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-3 rounded bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo Corporativo *</label>
            <input 
              type="file" name="logo" key={`logo-${resetKey}`} onChange={handleChange}
              className="w-full text-xs" accept="image/*"
            />
            {errores.logo && <p className="text-red-500 text-xs mt-1">{errores.logo[0]}</p>}
          </div>

          <div className="border p-3 rounded bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto del Local</label>
            <input 
              type="file" name="foto_local" key={`foto-${resetKey}`} onChange={handleChange}
              className="w-full text-xs" accept="image/*"
            />
          </div>
        </div>

        <button 
          type="submit" disabled={loading}
          className={`w-full text-white py-3 rounded-md font-semibold transition shadow-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Enviando solicitud segura...' : 'Enviar Registro'}
        </button>
      </form>
    </div>
  );
};

export default RegistroEmpresa;