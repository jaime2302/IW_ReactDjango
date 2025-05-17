import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ProductoList from './ProductoList';
import ProductoForm from './ProductoForm';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

const ProductoView = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [productos, setProductos] = useState([]);
  const [currentProducto, setCurrentProducto] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProductos();
      fetchStores();
    }
  }, [isAuthenticated]);

  const fetchProductos = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log(token);
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
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al guardar los datos');
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
    <div className="container mt-4">
      <h2>Gestión de Productos</h2>

      {isEditing ? (
        <ProductoForm
          producto={currentProducto}
          stores={stores}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              setCurrentProducto(null);
              setIsEditing(true);
            }}
          >
            Agregar Nuevo Producto
          </button>

          <ProductoList
            productos={productos}
            stores={stores}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default ProductoView;