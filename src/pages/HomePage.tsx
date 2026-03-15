import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="container text-center">
        <h1 className="h3 mb-3">Catálogo para WhatsApp</h1>
        <p className="text-muted small mb-4">
          Compartí tu catálogo con un link simple y gestioná pedidos desde un panel
          privado.
        </p>
        <p className="text-muted small mb-3">
          Esta es la vista pública. Los comercios gestionan su catálogo desde el panel.
        </p>
        <Link to="/presentacion" className="btn btn-primary btn-sm">
          Ver presentación del producto
        </Link>
      </div>
    </main>
  );
};

export default HomePage;

