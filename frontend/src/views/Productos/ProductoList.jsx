import React from 'react';
import ProductoTable from '../../components/Productos/ProductoTable';
import Error from '../../components/Error';

const ProductoList = ({ productos, stores, onEdit, onDelete }) => {
  if (!productos || productos.length === 0) {
    return <Error type="info" message="No hay productos registrados" />;
  }

  // Enriquecer datos con nombres de tiendas
  const enrichedProductos = productos.map(producto => {
    const store = stores.find(s => s.pk === producto.tienda);
    return {
      ...producto,
      tiendaNombre: store ? `${store.ciudad} - ${store.direccion}` : 'Desconocida'
    };
  });

  return (
    <div className="producto-list">
      <ProductoTable 
        productos={enrichedProductos} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    </div>
  );
};

export default ProductoList;