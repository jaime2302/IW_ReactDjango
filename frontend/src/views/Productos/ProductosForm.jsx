import React from 'react';
import { useForm } from 'react-hook-form';

const ProductoForm = ({ producto, tiendas, onSubmit, onCancel }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue
  } = useForm();

  React.useEffect(() => {
    if (producto) {
      setValue('name', producto.name);
      setValue('description', producto.description);
      setValue('price', producto.price);
      setValue('tienda', producto.tienda);
    }
  }, [producto, setValue]);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-4">
          {producto ? 'Editar Producto' : 'Nuevo Producto'}
        </h4>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nombre <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              {...register('name', { 
                required: 'El nombre es requerido',
                minLength: {
                  value: 3,
                  message: 'Mínimo 3 caracteres'
                }
              })}
            />
            {errors.name && (
              <div className="invalid-feedback">
                {errors.name.message}
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              {...register('description')}
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Precio <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                id="price"
                {...register('price', { 
                  required: 'El precio es requerido',
                  min: {
                    value: 0.01,
                    message: 'El precio debe ser mayor a 0'
                  }
                })}
              />
            </div>
            {errors.price && (
              <div className="invalid-feedback">
                {errors.price.message}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="tienda" className="form-label">
              Tienda <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors.tienda ? 'is-invalid' : ''}`}
              id="tienda"
              {...register('tienda', { 
                required: 'Debe seleccionar una tienda',
                valueAsNumber: true
              })}
            >
              <option value="">Seleccione una tienda</option>
              {tiendas.map(tienda => (
                <option key={tienda.pk} value={tienda.pk}>
                  {tienda.ciudad} - {tienda.direccion}
                </option>
              ))}
            </select>
            {errors.tienda && (
              <div className="invalid-feedback">
                {errors.tienda.message}
              </div>
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
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {producto ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoForm;