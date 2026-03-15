import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { getImageUrlOrDefault } from '../../utils/imageUrl';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: Props) => {
  const { items, totalItems, storeSlug, removeItem, setQuantity } = useCart();

  const total = items.reduce((acc, i) => acc + Number(i.price) * i.quantity, 0);

  if (!open) return null;

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 1040 }}
        onClick={onClose}
        onKeyDown={e => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Cerrar carrito"
      />
      <div
        className="position-fixed top-0 end-0 h-100 bg-white shadow d-flex flex-column"
        style={{ width: 'min(400px, 100vw)', zIndex: 1050 }}
      >
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-light">
          <h2 className="h6 mb-0 fw-semibold">Carrito</h2>
          <button
            type="button"
            className="btn btn-link text-secondary p-0 rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36 }}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="flex-grow-1 overflow-auto px-3 py-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {totalItems === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted mb-2" style={{ fontSize: '3rem' }}>🛒</div>
              <p className="text-muted small mb-0">Tu carrito está vacío</p>
            </div>
          ) : (
            <ul className="list-unstyled mb-0">
              {items.map(item => (
                <li
                  key={item.productId}
                  className="cart-drawer-item d-flex gap-3 align-items-center py-3 border-bottom"
                >
                  <div
                    className="cart-drawer-item-img rounded overflow-hidden flex-shrink-0 bg-light"
                    style={{ width: 56, height: 56 }}
                  >
                    <img
                      src={getImageUrlOrDefault(item.imageCoverUrl)}
                      alt={item.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <p className="mb-0 small fw-medium text-truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="mb-0 small text-muted">
                      ${Number(item.price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <p className="mb-0 small fw-semibold">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    {storeSlug && (
                      <button
                        type="button"
                        className="btn btn-link btn-sm text-danger p-0 mt-0"
                        onClick={() => removeItem(storeSlug, item.productId)}
                        aria-label="Quitar"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-top bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="small text-muted">Total</span>
            <span className="fw-bold fs-5">${total.toFixed(2)}</span>
          </div>
          {storeSlug && totalItems > 0 && (
            <div className="d-grid gap-2">
              <Link
                to={`/carrito?store=${encodeURIComponent(storeSlug)}`}
                className="btn btn-outline-primary"
                onClick={onClose}
              >
                Ver carrito completo
              </Link>
              <Link
                to={`/checkout?store=${encodeURIComponent(storeSlug)}`}
                className="btn btn-primary"
                onClick={onClose}
              >
                Finalizar pedido
              </Link>
            </div>
          )}
          {(!storeSlug || totalItems === 0) && (
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={onClose}
            >
              Seguir comprando
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
