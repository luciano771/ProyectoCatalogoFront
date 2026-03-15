import { useCart } from '../hooks/useCart';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getImageUrlOrDefault } from '../utils/imageUrl';

const CartPage = () => {
  const [searchParams] = useSearchParams();
  const store = searchParams.get('store');
  const { items, totalItems, setStoreSlug, storeSlug, loading, setQuantity, removeItem } = useCart();

  useEffect(() => {
    if (store) setStoreSlug(store);
  }, [store, setStoreSlug]);

  const total = items.reduce(
    (acc, i) => acc + Number(i.price) * i.quantity,
    0
  );

  if (store && storeSlug !== store) {
    return (
      <div className="container py-5 px-2 px-md-3">
        <div className="cart-page-empty">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted mt-2 mb-0">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container py-5 px-2 px-md-3">
        <div className="cart-page-empty">
          <span className="cart-page-empty-icon">🛒</span>
          <h1 className="h5 mt-2 mb-2">Carrito</h1>
          <p className="text-muted small mb-3">
            Elegí una tienda para ver tu carrito.
          </p>
          <Link to="/" className="btn btn-outline-primary btn-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="container py-5 px-2 px-md-3">
        <div className="cart-page-empty">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted mt-2 mb-0">Cargando...</p>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="container py-5 px-2 px-md-3">
        <div className="cart-page-empty">
          <span className="cart-page-empty-icon">🛒</span>
          <h1 className="h5 mt-2 mb-2">Carrito vacío</h1>
          <p className="text-muted small mb-3">
            Tu carrito está vacío. Agregá productos desde la tienda.
          </p>
          <Link to={`/tienda/${store}`} className="btn btn-primary btn-sm">
            Ir a la tienda
          </Link>
          <Link to="/" className="btn btn-link btn-sm text-muted mt-2">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 px-2 px-md-3" style={{ maxWidth: 720 }}>
      <h1 className="h4 fw-bold mb-4">Carrito de compras</h1>
      <div className="cart-page-list mb-4">
        {items.map(item => (
          <div
            key={item.productId}
            className="cart-page-item card border-0 shadow-sm rounded-3 mb-3 overflow-hidden"
          >
            <div className="card-body p-3">
              <div className="d-flex gap-3 align-items-center">
                <div
                  className="cart-page-item-img rounded-3 overflow-hidden flex-shrink-0 bg-light"
                  style={{ width: 80, height: 80 }}
                >
                  <img
                    src={getImageUrlOrDefault(item.imageCoverUrl)}
                    alt={item.name}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="flex-grow-1 min-width-0">
                  <h2 className="h6 fw-semibold mb-1 text-truncate" title={item.name}>
                    {item.name}
                  </h2>
                  <p className="mb-2 small text-muted">
                    ${Number(item.price).toFixed(2)} c/u
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <div className="d-flex align-items-center border rounded-pill bg-light">
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-1 px-2 text-dark text-decoration-none"
                        onClick={() => setQuantity(store!, item.productId, item.quantity - 1)}
                        aria-label="Menos"
                      >
                        −
                      </button>
                      <span className="px-2 small fw-semibold" style={{ minWidth: 28, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-1 px-2 text-dark text-decoration-none"
                        onClick={() => setQuantity(store!, item.productId, item.quantity + 1)}
                        aria-label="Más"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-danger p-0"
                      onClick={() => removeItem(store, item.productId)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <div className="text-end flex-shrink-0">
                  <p className="mb-0 fw-bold">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                  <p className="mb-0 small text-muted">subtotal</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card border-0 shadow-sm rounded-3 p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted">Total estimado</span>
          <span className="h4 fw-bold mb-0">${total.toFixed(2)}</span>
        </div>
        <Link
          to={`/checkout?store=${encodeURIComponent(store)}`}
          className="btn btn-primary w-100 py-2"
        >
          Ir al checkout
        </Link>
      </div>
      <div className="text-center">
        <Link to={`/tienda/${store}`} className="btn btn-link text-muted btn-sm">
          ← Seguir comprando
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
