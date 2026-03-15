import type { ReactNode } from 'react';
import { useState } from 'react';
import HeaderBar from './HeaderBar';
import CartDrawer from './CartDrawer';

const PublicLayout = ({ children }: { children: ReactNode }) => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <HeaderBar onOpenCart={() => setCartDrawerOpen(true)} />
      <main className="flex-grow-1 public-layout-main">{children}</main>
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <footer className="py-3 px-2 text-center text-muted small">
        Catálogo para WhatsApp · MVP
      </footer>
    </div>
  );
};

export default PublicLayout;

