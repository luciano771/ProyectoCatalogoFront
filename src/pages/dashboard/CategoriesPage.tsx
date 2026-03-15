import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category
} from '../../api/category-api';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formName, setFormName] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createCategory({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCreating(false);
      setFormName('');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      setFormName('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const handleStartEdit = (c: Category) => {
    setEditingId(c.id);
    setFormName(c.name);
  };

  const handleSaveEdit = () => {
    if (!editingId || !formName.trim()) return;
    updateMutation.mutate({ id: editingId, name: formName.trim() });
  };

  const handleCreate = () => {
    if (!formName.trim()) return;
    createMutation.mutate(formName.trim());
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <Alert variant="danger">No se pudieron cargar las categorías.</Alert>;
  }

  const categories = data?.categories ?? [];

  return (
    <div>
      <h1 className="h5 mb-3">Categorías</h1>

      {!isCreating ? (
        <Button
          type="button"
          size="sm"
          className="mb-3"
          onClick={() => {
            setIsCreating(true);
            setFormName('');
          }}
        >
          Nueva categoría
        </Button>
      ) : (
        <div className="card card-body mb-3 bg-light">
          <Input
            label="Nombre"
            value={formName}
            onChange={e => setFormName(e.target.value)}
            placeholder="Ej: Bebidas"
          />
          <div className="d-flex gap-2">
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={createMutation.isLoading || !formName.trim()}
            >
              {createMutation.isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setIsCreating(false);
                setFormName('');
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {categories.length === 0 && !isCreating ? (
        <p className="text-muted small">Aún no tenés categorías. Creá una para organizar productos.</p>
      ) : (
        <ul className="list-group">
          {categories.map(c => (
            <li
              key={c.id}
              className="list-group-item d-flex align-items-center justify-content-between"
            >
              {editingId === c.id ? (
                <>
                  <input
                    type="text"
                    className="form-control form-control-sm me-2"
                    style={{ maxWidth: 240 }}
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                  />
                  <div className="d-flex gap-1">
                    <Button size="sm" onClick={handleSaveEdit} disabled={updateMutation.isLoading}>
                      Guardar
                    </Button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        setEditingId(null);
                        setFormName('');
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{c.name}</span>
                  <div className="d-flex gap-1">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleStartEdit(c)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        if (window.confirm('¿Eliminar esta categoría?')) {
                          deleteMutation.mutate(c.id);
                        }
                      }}
                      disabled={deleteMutation.isLoading}
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoriesPage;
