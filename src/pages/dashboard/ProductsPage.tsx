import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  type Product
} from '../../api/product-api';
import { listCategories } from '../../api/category-api';
import { getImageUrlOrDefault } from '../../utils/imageUrl';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const emptyForm = {
  name: '',
  marca: '' as string | null,
  modelo: '' as string | null,
  description: '',
  price: 0,
  categoryId: '' as string | null,
  imageCoverUrl: '',
  stock: null as number | null,
  active: true
};

const ProductsPage = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories
  });
  const categories = catData?.categories ?? [];

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: listProducts
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsCreating(false);
      setForm(emptyForm);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateProduct>[1] }) =>
      updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingId(null);
      setForm(emptyForm);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: ({ productId, file }: { productId: string; file: File }) =>
      uploadProductImage(productId, file),
    onSuccess: res => {
      setForm(f => ({ ...f, imageCoverUrl: res.url }));
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      marca: p.marca ?? '',
      modelo: p.modelo ?? '',
      description: p.description ?? '',
      price: Number(p.price),
      categoryId: p.categoryId ?? '',
      imageCoverUrl: p.imageCoverUrl ?? '',
      stock: p.stock ?? null,
      active: p.active
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updateMutation.mutate({
      id: editingId,
      payload: {
        name: form.name,
        marca: form.marca || null,
        modelo: form.modelo || null,
        description: form.description || undefined,
        price: form.price,
        categoryId: form.categoryId || null,
        imageCoverUrl: form.imageCoverUrl || null,
        stock: form.stock,
        active: form.active
      }
    });
  };

  const handleCreate = () => {
    if (!form.name.trim()) return;
    createMutation.mutate({
      name: form.name,
      marca: form.marca || null,
      modelo: form.modelo || null,
      description: form.description || undefined,
      price: form.price,
      categoryId: form.categoryId || null,
      imageCoverUrl: form.imageCoverUrl || null,
      stock: form.stock,
      active: form.active
    });
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <Alert variant="danger">No se pudieron cargar los productos.</Alert>;
  }

  const products = data?.products ?? [];

  const formFields = (
    <>
      <Input
        label="Nombre"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        placeholder="Nombre del producto"
      />
      <Input
        label="Marca (opcional)"
        value={form.marca ?? ''}
        onChange={e => setForm(f => ({ ...f, marca: e.target.value || null }))}
        placeholder="Ej: HP, Dell"
      />
      <Input
        label="Modelo (opcional)"
        value={form.modelo ?? ''}
        onChange={e => setForm(f => ({ ...f, modelo: e.target.value || null }))}
        placeholder="Ej: PROBOOK 440 G6"
      />
      <div className="mb-3">
        <label className="form-label small">Descripción</label>
        <textarea
          className="form-control form-control-sm"
          rows={2}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Opcional"
        />
      </div>
      <Input
        label="Precio"
        type="number"
        step="0.01"
        min={0}
        value={form.price || ''}
        onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) || 0 }))}
      />
      <div className="mb-3">
        <label className="form-label small">Categoría</label>
        <select
          className="form-select form-select-sm"
          value={form.categoryId ?? ''}
          onChange={e =>
            setForm(f => ({ ...f, categoryId: e.target.value || null }))
          }
        >
          <option value="">Sin categoría</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label small">Imagen del producto</label>
        <p className="text-muted small mb-1">
          URL o subí un archivo (solo al editar). JPG, PNG, GIF o WebP, máx. 5 MB.
        </p>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Input
            value={form.imageCoverUrl}
            onChange={e => setForm(f => ({ ...f, imageCoverUrl: e.target.value }))}
            placeholder="https://... o subir archivo"
          />
          {editingId && (
            <>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="form-control form-control-sm"
                style={{ maxWidth: 200 }}
                disabled={uploadImageMutation.isPending}
                onChange={e => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (!file) return;
                  uploadImageMutation.mutate({ productId: editingId, file });
                }}
              />
              {uploadImageMutation.isPending && (
                <span className="small text-muted">Subiendo...</span>
              )}
            </>
          )}
        </div>
        <div className="mt-2">
          <img
            src={getImageUrlOrDefault(form.imageCoverUrl)}
            alt="Vista previa"
            style={{ maxHeight: 80, objectFit: 'contain' }}
            onError={e => {
              (e.target as HTMLImageElement).src = '/defaultImages/sinimagen.svg';
            }}
          />
        </div>
      </div>
      <Input
        label="Stock (opcional)"
        type="number"
        min={0}
        value={form.stock ?? ''}
        onChange={e =>
          setForm(f => ({
            ...f,
            stock: e.target.value === '' ? null : Number(e.target.value)
          }))
        }
      />
      <div className="form-check form-switch mb-3">
        <input
          id="active"
          type="checkbox"
          className="form-check-input"
          checked={form.active}
          onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
        />
        <label htmlFor="active" className="form-check-label small">
          Producto activo (visible en tienda)
        </label>
      </div>
    </>
  );

  return (
    <div>
      <h1 className="h5 mb-3">Productos</h1>

      {!isCreating && !editingId ? (
        <Button
          type="button"
          size="sm"
          className="mb-3"
          onClick={() => {
            setIsCreating(true);
            setForm(emptyForm);
          }}
        >
          Nuevo producto
        </Button>
      ) : (
        <div className="card card-body mb-4 bg-light">
          <h2 className="h6 mb-3">
            {editingId ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          {formFields}
          <div className="d-flex gap-2">
            <Button
              size="sm"
              onClick={editingId ? handleSaveEdit : handleCreate}
              disabled={
                (editingId ? updateMutation.isLoading : createMutation.isLoading) ||
                !form.name.trim()
              }
            >
              {editingId
                ? updateMutation.isLoading
                  ? 'Guardando...'
                  : 'Guardar'
                : createMutation.isLoading
                  ? 'Creando...'
                  : 'Crear'}
            </Button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {products.length === 0 && !isCreating && !editingId ? (
        <p className="text-muted small">
          Aún no tenés productos. Creá categorías primero (opcional) y luego agregá productos.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm table-hover">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className="small">{p.name}</td>
                  <td className="small">{p.marca ?? '-'}</td>
                  <td className="small">{p.modelo ?? '-'}</td>
                  <td className="small">${Number(p.price).toFixed(2)}</td>
                  <td className="small">{p.category?.name ?? '-'}</td>
                  <td className="small">
                    {p.active ? (
                      <span className="badge bg-success">Activo</span>
                    ) : (
                      <span className="badge bg-secondary">Inactivo</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm me-1"
                      onClick={() => handleStartEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        if (window.confirm('¿Eliminar este producto?')) {
                          deleteMutation.mutate(p.id);
                        }
                      }}
                      disabled={deleteMutation.isLoading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
