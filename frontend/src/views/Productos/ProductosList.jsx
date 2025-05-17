import React from 'react';

const ProductosList = ({ productos, tiendas, onEdit, onDelete }) => {
  const getTiendaNombre = (tiendaId) => {
    const tienda = tiendas.find(t => t.pk === tiendaId);
    return tienda ? `${tienda.ciudad} - ${tienda.direccion}` : 'Desconocida';
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>DescripciÃ³n</th>
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
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(producto.pk)}
                  >
                    <i className="fas fa-trash"></i>
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

export default ProductosList; 