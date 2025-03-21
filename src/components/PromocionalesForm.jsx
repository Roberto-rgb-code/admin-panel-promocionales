// admin-panel-promocionales/src/components/PromocionalesForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PromocionalesForm.css';

const apiUrl = import.meta.env.VITE_PROMOCIONALES_API_URL;

const PromocionalesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [promocional, setPromocional] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
  });

  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPromocional();
    }
  }, [id]);

  const fetchPromocional = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/promocionales-destacados/${id}`, {
        headers: { 'Accept': 'application/json' },
      });
      const data = response.data;
      setPromocional({
        nombre: data.nombre,
        descripcion: data.descripcion,
        categoria: data.categoria,
      });
      if (data.fotos && data.fotos.length > 0) {
        setExistingPhotos(data.fotos);
      }
    } catch (error) {
      setError('Error al obtener el promocional: ' + error.message);
      console.error('Error al obtener el promocional:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromocional({ ...promocional, [name]: value });
  };

  const handleAddMoreFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewPreviews(prev => [...prev, ...previews]);
  };

  const handleRemoveExistingPhoto = async (fotoId) => {
    try {
      if (!window.confirm('¿Eliminar esta foto?')) return;
      await axios.delete(`${apiUrl}/api/fotos/${fotoId}`);
      setExistingPhotos(prev => prev.filter(f => f.id !== fotoId));
    } catch (err) {
      console.error('Error al eliminar la foto:', err);
      alert('No se pudo eliminar la foto');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('nombre', promocional.nombre);
    formData.append('descripcion', promocional.descripcion);
    formData.append('categoria', promocional.categoria);

    if (newFiles.length > 0) {
      newFiles.forEach((file, index) => {
        formData.append(`fotos[${index}]`, file);
      });
    }

    try {
      if (id) {
        await axios.put(`${apiUrl}/api/promocionales-destacados/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${apiUrl}/api/promocionales-destacados`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        setError('Validación fallida: ' + Object.values(validationErrors).flat().join(', '));
        console.error('Errores de validación:', validationErrors);
      } else {
        setError('Error al guardar el promocional: ' + (error.response?.data?.message || error.message));
      }
      console.error('Error completo al guardar el promocional:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>{id ? 'Editar Promocional Destacado' : 'Agregar Promocional Destacado'}</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error-message" style={{ color: 'red' }}>{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="promocional-form" encType="multipart/form-data">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={promocional.nombre}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={promocional.descripcion}
              onChange={handleChange}
              required
              className="form-textarea"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select
              name="categoria"
              value={promocional.categoria}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Selecciona una categoría</option>
              <option value="Agendas Zegno">Agendas Zegno</option>
              <option value="Antiestres">Antiestres</option>
              <option value="Artículos de Viaje">Artículos de Viaje</option>
              <option value="Bar">Bar</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Belleza">Belleza</option>
              <option value="Bolsas">Bolsas</option>
              <option value="Complementos">Complementos</option>
              <option value="Deportes">Deportes</option>
              <option value="Entretenimiento">Entretenimiento</option>
              <option value="Escritura">Escritura</option>
              <option value="Herramientas">Herramientas</option>
              <option value="Hieleras Loncheras y Portaviandas">Hieleras Loncheras y Portaviandas</option>
              <option value="Hogar">Hogar</option>
              <option value="Libretas y Carpetas">Libretas y Carpetas</option>
              <option value="Llaveros">Llaveros</option>
              <option value="Maletas">Maletas</option>
              <option value="Mochilas">Mochilas</option>
              <option value="Niños">Niños</option>
              <option value="Oficina">Oficina</option>
              <option value="Paraguas e Impermeables">Paraguas e Impermeables</option>
              <option value="Portafolios">Portafolios</option>
              <option value="Salud">Salud</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Textiles">Textiles</option>
            </select>
          </div>
          {existingPhotos.length > 0 && (
            <div className="form-group">
              <label>Fotos Existentes</label>
              <div className="existing-photos">
                {existingPhotos.map((foto) => (
                  <div key={foto.id} className="existing-photo">
                    <img
                      src={`${apiUrl}/storage/${foto.foto_path}`}
                      alt="Foto existente"
                      className="existing-photo-img"
                    />
                    <button
                      type="button"
                      className="remove-existing-btn"
                      onClick={() => handleRemoveExistingPhoto(foto.id)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="form-group">
            <label>Nuevas Fotos</label>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              multiple
              accept="image/*"
              onChange={handleFilesChange}
            />
            <button type="button" className="btn btn-primary" onClick={handleAddMoreFiles}>
              Agregar más fotos
            </button>
            {newPreviews.length > 0 && (
              <div className="preview-images">
                {newPreviews.map((src, index) => (
                  <div key={index} className="preview-image">
                    <img src={src} alt={`Vista previa ${index}`} className="preview-img" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PromocionalesForm;