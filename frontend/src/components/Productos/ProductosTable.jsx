import React from 'react';

const ProductosTable = ({ productos, tiendas, onEdit, onDelete }) => {
  // Función para obtener el nombre de la tienda basado en el ID
  const getTiendaNombre = (tiendaId) => {
    const tienda = tiendas.find(t => t.pk === tiendaId);
    return tienda ? `${tienda.ciudad} - ${tienda.direccion}` : 'Desconocida';
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Tienda</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.pk}>
              <td>{producto.name}</td>
              <td>{producto.description || '-'}</td>
              <td>${producto.price.toFixed(2)}</td>
              <td>{getTiendaNombre(producto.tienda)}</td>
              <td>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEdit(producto)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de eliminar este producto?')) {
                        onDelete(producto.pk);
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductosTable;