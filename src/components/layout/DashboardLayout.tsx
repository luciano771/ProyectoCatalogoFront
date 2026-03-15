import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { to: '/panel', end: true, label: 'Inicio' },
  { to: '/panel/perfil', end: false, label: 'Perfil' },
  { to: '/panel/categorias', end: false, label: 'Categorías' },
  { to: '/panel/productos', end: false, label: 'Productos' },
  { to: '/panel/carga-masiva', end: false, label: 'Carga masiva' },
  { to: '/panel/pedidos', end: false, label: 'Pedidos' }
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const NavContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {navLinks.map(({ to, end, label }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `d-block px-3 py-2 rounded-2 mb-1 text-decoration-none ${
              isActive ? 'bg-primary text-white' : 'text-dark'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="d-flex min-vh-100 bg-light">
      <aside className="bg-white border-end d-none d-md-flex flex-column" style={{ width: 240 }}>
        <div className="p-3 border-bottom">
          <div className="fw-semibold small">Panel de comercio</div>
          <div className="text-muted small text-break">{user?.email}</div>
        </div>
        <nav className="flex-grow-1 p-2 small">
          <NavContent />
        </nav>
        <button
          type="button"
          className="btn btn-link text-muted text-decoration-none small m-3 mb-4"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </aside>
      <div className="flex-grow-1 d-flex flex-column min-vw-0">
        <header className="d-md-none bg-white border-bottom py-2 px-3 small d-flex align-items-center justify-content-between">
          <span>Panel de comercio</span>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Abrir menú"
          >
            ☰ Menú
          </button>
        </header>
        <div
          className={`offcanvas offcanvas-start d-md-none ${mobileNavOpen ? 'show' : ''}`}
          tabIndex={-1}
          id="dashboard-mobile-nav"
          aria-labelledby="dashboard-mobile-nav-label"
        >
          <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title small" id="dashboard-mobile-nav-label">
              Menú
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={() => setMobileNavOpen(false)}
            />
          </div>
          <div className="offcanvas-body p-2 small">
            <nav>
              <NavContent onNavigate={() => setMobileNavOpen(false)} />
            </nav>
            <button
              type="button"
              className="btn btn-link text-muted text-decoration-none small mt-2"
              onClick={() => {
                logout();
                setMobileNavOpen(false);
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <div
            className="offcanvas-backdrop fade show d-md-none"
            style={{ zIndex: 1040 }}
            onClick={() => setMobileNavOpen(false)}
            onKeyDown={e => e.key === 'Escape' && setMobileNavOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Cerrar menú"
          />
        )}
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

