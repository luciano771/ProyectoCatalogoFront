import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

interface Props {
  onOpenCart?: () => void;
}

const HeaderBar = ({ onOpenCart }: Props) => {
  const { totalItems, storeSlug } = useCart();
  const cartStore = storeSlug;
  const cartUrl = cartStore ? `/carrito?store=${encodeURIComponent(cartStore)}` : '/carrito';

  const handleCartClick = (e: React.MouseEvent) => {
    if (onOpenCart) {
      e.preventDefault();
      onOpenCart();
    }
  };

  return (
    <header className="header-bar-fixed border-bottom bg-white shadow-sm">
      <div className="container py-2 py-md-3 px-2 px-md-3 d-flex justify-content-between align-items-center">
        <Link to="/" className="fw-semibold text-decoration-none text-dark text-truncate me-2">
          Catálogo WhatsApp
        </Link>
        <Link
          to={cartUrl}
          className="text-decoration-none text-secondary small d-flex align-items-center"
          onClick={handleCartClick}
        >
          🛒 Carrito
          {totalItems > 0 && (
            <span className="badge bg-primary ms-2">{totalItems}</span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default HeaderBar;

