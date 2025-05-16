import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const PersonalForm = ({ personal, stores, onSubmit, onCancel }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (personal) {
      setValue('nombre', personal.nombre);
      setValue('dni', personal.dni);
      setValue('tienda', personal.tienda);
    }
  }, [personal, setValue]);

  const submitHandler = (data) => {
    try {
      onSubmit(data);
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
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              id="nombre"
              {...register('nombre', { required: 'Nombre es requerido' })}
            />
            {errors.nombre && (
              <div className="invalid-feedback">{errors.nombre.message}</div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="dni" className="form-label">DNI</label>
            <input
              type="text"
              className={`form-control ${errors.dni ? 'is-invalid' : ''}`}
              id="dni"
              {...register('dni', { 
                required: 'DNI es requerido',
                pattern: {
                  value: /^[0-9]{8}[A-Za-z]$/,
                  message: 'DNI debe tener 8 números y una letra'
                }
              })}
            />
            {errors.dni && (
              <div className="invalid-feedback">{errors.dni.message}</div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="tienda" className="form-label">Tienda</label>
            <select
              className={`form-select ${errors.tienda ? 'is-invalid' : ''}`}
              id="tienda"
              {...register('tienda', { required: 'Tienda es requerida' })}
            >
              <option value="">Seleccionar Tienda</option>
              {stores.map(store => (
                <option key={store.pk} value={store.pk}>
                  {store.ciudad} - {store.direccion}
                </option>
              ))}
            </select>
            {errors.tienda && (
              <div className="invalid-feedback">{errors.tienda.message}</div>
            )}
          </div>
          
          <div className="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
            >
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