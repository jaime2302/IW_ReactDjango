import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const TiendaForm = ({ tienda, onSubmit, onCancel }) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [error, setError] = React.useState(null);

  // Inicializar valores del formulario
  useEffect(() => {
    if (tienda) {
      setValue('ciudad', tienda.ciudad);
      setValue('direccion', tienda.direccion);
      setValue('cp', tienda.cp);
    } else {
      reset({
        ciudad: '',
        direccion: '',
        cp: '',
      });
    }
  }, [tienda, setValue, reset]);

  const submitHandler = (data) => {
    try {
      // Convertir CP a integer
      const payload = {
        ...data,
        cp: parseInt(data.cp, 10)
      };
      onSubmit(payload);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">
          {tienda ? 'Editar Tienda' : 'Nueva Tienda'}
        </h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mb-3">
            <label htmlFor="ciudad" className="form-label">Ciudad</label>
            <input
              type="text"
              className={`form-control ${errors.ciudad ? 'is-invalid' : ''}`}
              id="ciudad"
              {...register('ciudad', { required: 'Este campo es obligatorio' })}
            />
            {errors.ciudad && <div className="invalid-feedback">{errors.ciudad.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input
              type="text"
              className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
              id="direccion"
              {...register('direccion', { required: 'Este campo es obligatorio' })}
            />
            {errors.direccion && <div className="invalid-feedback">{errors.direccion.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="cp" className="form-label">Código Postal</label>
            <input
              type="number"
              className={`form-control ${errors.cp ? 'is-invalid' : ''}`}
              id="cp"
              {...register('cp', { 
                required: 'Este campo es obligatorio',
                min: { value: 1000, message: 'El CP debe ser válido' },
                max: { value: 99999, message: 'El CP debe ser válido' }
              })}
            />
            {errors.cp && <div className="invalid-feedback">{errors.cp.message}</div>}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {tienda ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TiendaForm;