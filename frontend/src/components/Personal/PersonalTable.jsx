import React from 'react';

const PersonalTable = ({ personal, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Tienda</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personal.map(employee => (
            <tr key={employee.pk}>
              <td>{employee.nombre}</td>
              <td>{employee.dni}</td>
              <td>{employee.tiendaNombre}</td>
              <td>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEdit(employee)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
                        onDelete(employee.pk);
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

export default PersonalTable;