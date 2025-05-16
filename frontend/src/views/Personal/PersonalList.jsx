import React from 'react';
import PersonalTable from '../../components/Personal/PersonalTable';
import Error from '../../components/Error';

const PersonalList = ({ personal, stores, onEdit, onDelete }) => {
  if (!personal || personal.length === 0) {
    return <Error type="info" message="No hay personal registrado" />;
  }

  // Enriquecer datos con nombres de tiendas
  const enrichedPersonal = personal.map(employee => {
    const store = stores.find(s => s.pk === employee.tienda);
    return {
      ...employee,
      tiendaNombre: store ? `${store.ciudad} - ${store.direccion}` : 'Desconocida'
    };
  });

  return (
    <div className="personal-list">
      <PersonalTable 
        personal={enrichedPersonal} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    </div>
  );
};

export default PersonalList;