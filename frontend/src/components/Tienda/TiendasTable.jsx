import React from 'react';

const TiendaTable = ({ tiendas, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
          <tr>
            <th>Ciudad</th>
            <th>Dirección</th>
            <th>CP</th>
            <th>Acciones</th>
          </tr>
        <tbody>
          {tiendas.length > 0 ? (
            tiendas.map(tienda => (
              <tr key={tienda.pk}>
                <td>{tienda.ciudad}</td>
                <td>{tienda.direccion}</td>
                <td>{tienda.cp}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => onEdit(tienda)}
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        if (window.confirm(`¿Eliminar la tienda "${tienda.ciudad}"?`)) {
                          onDelete(tienda.pk);
                        }
                      }}
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No hay tiendas registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TiendaTable;