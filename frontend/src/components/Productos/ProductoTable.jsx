import React from 'react';

const ProductoTable = ({ productos, onEdit, onDelete }) => {
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
              <td>{producto.price.toFixed(2)}€</td>
              <td>{producto.tiendaNombre}</td>
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

export default ProductoTable;