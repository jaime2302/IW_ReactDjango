import React from 'react';
import TiendaTable from '../../components/Tienda/TiendasTable';

const TiendaList = ({ tiendas, onEdit, onDelete }) => {
  return (
    <div>
      {tiendas.length === 0 ? (
        <p className="text-muted">No hay tiendas registradas</p>
      ) : (
        <TiendaTable 
          tiendas={tiendas} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      )}
    </div>
  );
};

export default TiendaList;