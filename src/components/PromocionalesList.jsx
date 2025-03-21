// admin-panel-promocionales/src/components/PromocionalesList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './PromocionalesList.css';

const PromocionalesList = () => {
  const [promocionales, setPromocionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_PROMOCIONALES_API_URL;

  useEffect(() => {
    fetchPromocionales();
  }, []);

  const fetchPromocionales = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/promocionales-destacados`, {
        headers: { 'Accept': 'application/json' },
      });
      setPromocionales(response.data);
    } catch (error) {
      setError('Error al obtener promocionales: ' + error.message);
      console.error('Error al obtener promocionales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este promocional?')) {
      try {
        await axios.delete(`${apiUrl}/api/promocionales-destacados/${id}`);
        fetchPromocionales();
      } catch (error) {
        setError('Error al eliminar el promocional: ' + error.message);
        console.error('Error al eliminar el promocional:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 text-red-600">
          <p className="text-xl mb-2">{error}</p>
          <button onClick={() => fetchPromocionales()} className="mt-4 btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Administrar Promocionales Destacados</h1>
      <Link to="/nuevo" className="btn btn-primary">Agregar Promocional</Link>
      {promocionales.length === 0 ? (
        <p>No hay promocionales registrados.</p>
      ) : (
        <div className="promocionales-grid">
          {promocionales.map((promo) => (
            <div key={promo.id} className="promocional-card">
              <div className="promocional-images">
                {promo.fotos && promo.fotos.length > 0 ? (
                  <img
                    src={`${apiUrl}/storage/${promo.fotos[0].foto_path}`}
                    alt={promo.nombre}
                    className="promocional-image"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+image';
                    }}
                  />
                ) : promo.foto_path ? (
                  <img
                    src={`${apiUrl}/storage/${promo.foto_path}`}
                    alt={promo.nombre}
                    className="promocional-image"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+image';
                    }}
                  />
                ) : (
                  <div className="promocional-image placeholder">No hay foto</div>
                )}
              </div>
              <div className="promocional-content">
                <h3>{promo.nombre}</h3>
                <p>{promo.descripcion}</p>
                <p>Categoría: {promo.categoria}</p>
                <div className="promocional-actions">
                  <Link to={`/editar/${promo.id}`} className="btn btn-primary-small">Editar</Link>
                  <button className="btn btn-secondary-small" onClick={() => handleDelete(promo.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromocionalesList;