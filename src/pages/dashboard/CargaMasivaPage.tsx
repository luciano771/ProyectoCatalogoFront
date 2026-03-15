import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { downloadBulkTemplate, bulkImportProducts } from '../../api/product-api';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';

const CargaMasivaPage = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const importMutation = useMutation({
    mutationFn: bulkImportProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  });

  const handleDownloadTemplate = async () => {
    setDownloadLoading(true);
    try {
      await downloadBulkTemplate();
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    importMutation.mutate(file);
  };

  const result = importMutation.data;

  return (
    <div>
      <h1 className="h5 mb-3">Carga masiva</h1>
      <p className="text-muted small mb-4">
        Descargá la plantilla Excel, completala con tus productos y subila aquí. Las categorías
        que indiques se crearán automáticamente si no existen. Los productos sin URL de imagen
        usarán tu foto de portada o una imagen por defecto.
      </p>

      <div className="card card-body mb-4 bg-light">
        <h2 className="h6 mb-3">Plantilla de ejemplo</h2>
        <p className="small text-muted mb-3">
          La plantilla incluye: Nombre, Marca, Modelo, Precio, Descripción, Stock, Categoría, URL
          imagen, Activo. También podés usar columnas como MARCA, MODELO, CONTADO, PRECIO DE LISTA,
          DESCRIPCIÓN, STOCK (BAJO/MEDIO/ALTO). Descargala y completala con tus datos.
        </p>
        <div className="d-flex justify-content-start">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            style={{ width: '25%' }}
            onClick={handleDownloadTemplate}
            disabled={downloadLoading}
          >
          {downloadLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              Descargando...
            </>
          ) : (
            'Descargar plantilla Excel'
          )}
        </button>
        </div>
      </div>

      <div className="card card-body">
        <h2 className="h6 mb-3">Subir Excel</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small">Archivo (.xlsx o .xls)</label>
            <input
              ref={fileInputRef}
              type="file"
              className="form-control form-control-sm"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!file || importMutation.isPending}
          >
            {importMutation.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Importando...
              </>
            ) : (
              'Importar productos'
            )}
          </Button>
        </form>

        {importMutation.isError && (
          <Alert variant="danger" className="mt-3 mb-0">
            {importMutation.error instanceof Error
              ? importMutation.error.message
              : 'Error al importar'}
          </Alert>
        )}

        {result && (
          <div className="mt-3">
            <Alert variant={result.errors.length > 0 ? 'warning' : 'success'}>
              <strong>Importación finalizada.</strong> Productos creados: {result.created}
              {result.errors.length > 0 && (
                <>
                  <br />
                  <span className="small">
                    Errores en filas: {result.errors.map(e => `${e.row} (${e.message})`).join('; ')}
                  </span>
                </>
              )}
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default CargaMasivaPage;
