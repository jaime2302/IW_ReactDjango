import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const ProductoForm = ({ producto, stores, onSubmit, onCancel }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (producto) {
      setValue('name', producto.name);
      setValue('description', producto.description);
      setValue('price', producto.price);
      setValue('stock', producto.stock);
      setValue('tienda', producto.tienda);
    } else {
      setValue('name', '');
      setValue('description', '');
      setValue('price', 1);
      setValue('tienda', '');
    }
  }, [producto, setValue]);

  const submitHandler = (data) => {
    try {
      const payload = { 
        ...data, 
        tienda: parseInt(data.tienda, 10),
        stock: parseInt(data.stock, 10),
        price: parseFloat(data.price)
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
          {producto ? 'Editar Producto' : 'Nuevo Producto'}
        </h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              {...register('name')}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              {...register('description')}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">Precio</label>
            <input
              type="number"
              className="form-control"
              id="price"
              min="0.01"
              step="0.01"
              required
              {...register('price')}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="stock" className="form-label">Stock</label>
            <input
              type="number"
              className="form-control"
              id="stock"
              min="0"
              required
              {...register('stock')}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="tienda" className="form-label">Tienda</label>
            <select
              className="form-select"
              id="tienda"
              required
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
              {producto ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoForm;