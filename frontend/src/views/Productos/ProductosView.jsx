import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ProductosList from './ProductosList';
import ProductosForm from './ProductosForm';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

const ProductosView = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [productos, setProductos] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [currentProducto, setCurrentProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProductos();
      fetchTiendas();
    }
  }, [isAuthenticated]);

  const fetchProductos = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8000/producto/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener productos');

      const data = await response.json();
      setProductos(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchTiendas = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8000/tienda/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener tiendas');

      const data = await response.json();
      setTiendas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (producto) => {
    setCurrentProducto(producto);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCurrentProducto(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    try {
      const token = await getAccessTokenSilently();
      let url, method;

      if (currentProducto) {
        url = `http://localhost:8000/producto/${currentProducto.pk}`;
        method = 'PUT';
      } else {
        url = 'http://localhost:8000/producto/';
        method = 'POST';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          tienda: parseInt(formData.tienda),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al guardar los datos');
      }

      fetchProductos();
      setIsEditing(false);
      setCurrentProducto(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
        return;
      }

      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8000/producto/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar el producto');

      fetchProductos();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="productos-view">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Productos</h2>
        {!isEditing && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setCurrentProducto(null);
              setIsEditing(true);
            }}
          >
            <i className="fas fa-plus me-2"></i>
            Nuevo Producto
          </button>
        )}
      </div>

      {isEditing ? (
        <ProductosForm
          producto={currentProducto}
          tiendas={tiendas}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <ProductosList
          productos={productos}
          tiendas={tiendas}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ProductosView;