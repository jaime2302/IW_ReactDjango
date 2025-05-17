import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const PersonalForm = ({ personal, stores, onSubmit, onCancel }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (personal) {
      setValue('nombre', personal.nombre);
      setValue('dni', personal.dni);
      setValue('tienda', personal.tienda?.pk || '');
    } else {
      setValue('nombre', '');
      setValue('dni', '');
      setValue('tienda', '');
    }
  }, [personal, setValue]);

  const submitHandler = (data) => {
    try {
      const payload = { ...data, tienda: parseInt(data.tienda, 10) };
      onSubmit(payload);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">
          {personal ? 'Editar Empleado' : 'Nuevo Empleado'}
        </h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              {...register('nombre')}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="dni" className="form-label">DNI</label>
            <input
              type="text"
              className="form-control"
              id="dni"
              {...register('dni')}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="tienda" className="form-label">Tienda</label>
            <select
              className="form-select"
              id="tienda"
              {...register('tienda')}
            >
              <option value="">Seleccionar Tienda</option>
              {stores.map(store => (
                <option key={store.pk} value={store.pk}>
                  {store.ciudad} - {store.direccion}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {personal ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalForm;
