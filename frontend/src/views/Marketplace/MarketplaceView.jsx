import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Table, Button, Badge, Modal, Alert } from 'react-bootstrap';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

const MarketplaceView = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [cart, setCart] = useState([]);
  const [stockAlert, setStockAlert] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('http://localhost:8000/producto/', {
          headers: { Authorization: `Bearer ${token}` }
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

    fetchProductos();
  }, [getAccessTokenSilently]);

  const handleShowDetails = (producto) => {
    setSelectedProduct(producto);
    setShowDetails(true);
  };

  const handleAddToCart = async (producto) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8000/marketplace/${producto.pk}/reservar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cantidad: 1 })
      });

      if (!response.ok) {
        throw new Error(`No se pudo reservar 1 unidad de ${producto.name}`);
      }

      const data = await response.json();
      const reservado = data.reservado || 1;

      const existingItem = cart.find(item => item.id === producto.pk);
      if (existingItem) {
        setCart(cart.map(item =>
          item.id === producto.pk
            ? { ...item, quantity: item.quantity + reservado }
            : item
        ));
      } else {
        setCart([...cart, {
          id: producto.pk,
          name: producto.name,
          price: producto.price,
          quantity: reservado
        }]);
      }

      setProductos(productos.map(p =>
        p.pk === producto.pk
          ? { ...p, stock: p.stock - reservado }
          : p
      ));

      setStockAlert('');
    } catch (err) {
      setStockAlert(err.message);
      setCart(cart.filter(item => item.id !== producto.pk));
      setProductos(productos.map(p =>
        p.pk === producto.pk
          ? { ...p, stock: p.stock + 1 }
          : p
      ));
    }
  };


  const liberarStock = async (productoId, cantidad) => {
    try {
      const token = await getAccessTokenSilently();
      await fetch(`http://localhost:8000/marketplace/${productoId}/liberar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cantidad })
      });
    } catch (err) {
      console.error('Error liberando stock:', err);
    }
  };

  const handleRemoveFromCart = (productId, removeAll = false) => {
    const itemToRemove = cart.find(item => item.id === productId);
    if (!itemToRemove) return;

    if (removeAll || itemToRemove.quantity === 1) {
      setCart(cart.filter(item => item.id !== productId));
      setProductos(productos.map(p =>
        p.pk === productId
          ? { ...p, stock: p.stock + itemToRemove.quantity }
          : p
      ));
      liberarStock(productId, itemToRemove.quantity);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
      setProductos(productos.map(p =>
        p.pk === productId
          ? { ...p, stock: p.stock + 1 }
          : p
      ));
      liberarStock(productId, 1);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const finalizarCompra = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8000/marketplace/confirmar_compra', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          producto: cart.map(item => ({
            id: item.pk,
            cantidad: item.stock
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al finalizar la compra');
      }

      const data = await response.json();
      setProductos(data.productosActualizados || productos);
      setCart([]);
      setStockAlert('');
      alert('¡Compra finalizada con éxito!');
    } catch (err) {
      setStockAlert(err.message);
    }
  };



  return (
    <div className="marketplace-view">
      <h2 className="mb-4">Marketplace</h2>

      {stockAlert && (
        <Alert variant="warning" onClose={() => setStockAlert('')} dismissible>
          {stockAlert}
        </Alert>
      )}

      <div className="row">
        <div className="col-md-8">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.pk}>
                  <td>{producto.name}</td>
                  <td>{producto.price.toFixed(2)}€</td>
                  <td>
                    <Badge bg={producto.stock > 0 ? 'success' : 'danger'}>
                      {producto.stock}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleShowDetails(producto)}
                      className="me-2"
                    >
                      Ver detalles
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddToCart(producto)}
                      disabled={producto.stock <= 0}
                    >
                      Añadir al carrito
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Carrito de Compras</h5>
            </div>
            <div className="card-body">
              {cart.length === 0 ? (
                <p className="text-muted">Tu carrito está vacío</p>
              ) : (
                <>
                  <ul className="list-group mb-3">
                    {cart.map(item => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{item.name}</strong><br />
                          <small>{item.price.toFixed(2)}€ c/u</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-primary rounded-pill me-2">{item.quantity}</span>
                          <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFromCart(item.id, false)} className="me-1">-1</Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFromCart(item.id, true)}>×</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>Total:</h5>
                    <h4>{calculateTotal().toFixed(2)}€</h4>
                  </div>
                  <Button variant="success" className="w-100 mt-3" onClick={finalizarCompra}>
                    Finalizar Compra
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <p><strong>Descripción:</strong> {selectedProduct.description || 'No disponible'}</p>
              <p><strong>Precio:</strong> ${selectedProduct.price.toFixed(2)}</p>
              <p>
                <strong>Stock disponible:</strong>
                <Badge bg={selectedProduct.stock > 0 ? 'success' : 'danger'} className="ms-2">
                  {selectedProduct.stock}
                </Badge>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>Cerrar</Button>
          <Button
            variant="primary"
            onClick={() => {
              handleAddToCart(selectedProduct);
              setShowDetails(false);
            }}
            disabled={!selectedProduct || selectedProduct.stock <= 0}
          >
            Añadir al carrito
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MarketplaceView;
