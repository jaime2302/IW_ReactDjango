import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import TiendaList from './TiendaList';
import TiendaForm from './TiendaForm';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

const TiendaView = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [tiendas, setTiendas] = useState([]);
  const [currentTienda, setCurrentTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchTiendas();
  }, [isAuthenticated]);

  const fetchTiendas = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8000/tienda/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al obtener tiendas');
      const data = await response.json();
      setTiendas(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEdit = (tienda) => {
    setCurrentTienda(tienda);
    setIsEditing(true);
  };

  const handleDelete = async (pk) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8000/tienda/${pk}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al eliminar');
      fetchTiendas();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = await getAccessTokenSilently();
      const url = currentTienda 
        ? `http://localhost:8000/tienda/${currentTienda.pk}` 
        : 'http://localhost:8000/tienda/';
      const method = currentTienda ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar');
      fetchTiendas();
      setIsEditing(false);
      setCurrentTienda(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="container mt-4">
      <h2>Gestión de Tiendas</h2>
      {isEditing ? (
        <TiendaForm 
          tienda={currentTienda} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <>
          <button 
            className="btn btn-primary mb-3" 
            onClick={() => { setCurrentTienda(null); setIsEditing(true); }}
          >
            Nueva Tienda
          </button>
          <TiendaList 
            tiendas={tiendas} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </>
      )}
    </div>
  );
};

export default TiendaView;