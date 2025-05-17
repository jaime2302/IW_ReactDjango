import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import PersonalList from './PersonalList';
import PersonalForm from './PersonalForm';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

const PersonalView = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [personal, setPersonal] = useState([]);
  const [currentPersonal, setCurrentPersonal] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPersonal();
      fetchStores();
    }
  }, [isAuthenticated]);

  const fetchPersonal = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8000/personal/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener personal');

      const data = await response.json();
      setPersonal(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8000/tienda/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener tiendas');

      const data = await response.json();
      setStores(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (employee) => {
    setCurrentPersonal(employee);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCurrentPersonal(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    try {
      const token = await getAccessTokenSilently();
      let url, method;

      if (currentPersonal) {
        url = `http://localhost:8000/personal/${currentPersonal.pk}/`;
        method = 'PUT';
      } else {
        url = 'http://localhost:8000/personal/';
        method = 'POST';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tienda: parseInt(formData.tienda),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Error al guardar los datos');
      }

      fetchPersonal();
      setIsEditing(false);
      setCurrentPersonal(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8000/personal/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar el empleado');

      fetchPersonal();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="personal-view">
      <h2>Gestión de Personal</h2>

      {isEditing ? (
        <PersonalForm
          personal={currentPersonal}
          stores={stores}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              setCurrentPersonal(null);
              setIsEditing(true);
            }}
          >
            Agregar Nuevo Empleado
          </button>

          <PersonalList
            personal={personal}
            stores={stores}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default PersonalView;