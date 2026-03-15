import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getStoreProduct } from '../api/store-api';
import { getImageUrlOrDefault } from '../utils/imageUrl';
import { useCart } from '../hooks/useCart';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';

const ProductDetailPage = () => {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const navigate = useNavigate();
  const { setStoreSlug, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) setStoreSlug(slug);
    return () => setStoreSlug(null);
  }, [slug, setStoreSlug]);

  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['store-product', slug, productId],
    queryFn: () => getStoreProduct(slug ?? '', productId ?? ''),
    enabled: !!slug && !!productId
  });

  if (isLoading) {
    return (
      <div className="container py-5 d-flex justify-content-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container py-5">
        <Alert variant="danger">Producto no encontrado.</Alert>
        <Link to={slug ? `/tienda/${slug}` : '/'} className="btn btn-outline-primary btn-sm mt-2">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const { profile, product, related } = data;
  const maxQty = product.stock != null ? Math.max(1, product.stock) : 99;
  const effectiveQty = Math.min(Math.max(1, quantity), maxQty);

  const handleAddToCart = () => {
    addItem(profile.slug, product.id, effectiveQty);
  };

  const handleBuyNow = () => {
    addItem(profile.slug, product.id, effectiveQty);
    navigate(`/checkout?store=${encodeURIComponent(profile.slug)}`, {
      state: { slug: profile.slug }
    });
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          url
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Enlace copiado');
      }
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="store-gradient-bg min-vh-100"
      data-store-theme={profile.themeId || 'minimal-clean'}
    >
      <div className="container py-4 px-2 px-md-3">
        <StoreHeader profile={profile} />

        <nav aria-label="breadcrumb" className="mb-3 small">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/tienda/${slug}`} className="text-decoration-none">
                {profile.businessName}
              </Link>
            </li>
            {product.categoryName && (
              <li className="breadcrumb-item">
                <Link
                  to={`/tienda/${slug}?categoria=${product.categoryId}`}
                  className="text-decoration-none"
                >
                  {product.categoryName}
                </Link>
              </li>
            )}
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="store-detail-card mb-4">
          <div className="row g-0">
            <div className="col-12 col-md-6">
              <img
                src={getImageUrlOrDefault(product.imageCoverUrl)}
                alt={product.name}
                className="w-100 store-detail-img"
              />
            </div>
            <div className="col-12 col-md-6 p-3 p-md-4 d-flex flex-column">
              {product.categoryName && (
                <span className="store-category-tag mb-2">• {product.categoryName}</span>
              )}
              <h1 className="h4 fw-bold mb-2">{product.name}</h1>
              <div className="small text-warning mb-2">★★★★★ (4.9)</div>
              <div className="store-detail-price-box mb-3">
                <span className="price">${Number(product.price).toFixed(2)}</span>
              </div>
              {product.description && (
                <div className="store-detail-desc-box mb-3">
                  <span className="small text-muted d-block mb-1">📝 Descripción</span>
                  <p className="small mb-0">{product.description}</p>
                </div>
              )}
              {product.stock != null && (
                <p className="small text-muted mb-2">
                  {product.stock > 0 ? (
                    <>Disponibles: {product.stock}</>
                  ) : (
                    <span className="text-danger">Sin stock</span>
                  )}
                </p>
              )}

              <div className="mb-3">
                <span className="small text-muted d-block mb-2">Cantidad</span>
                <div className="d-flex align-items-center gap-1">
                  <button
                    type="button"
                    className="store-qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={effectiveQty <= 1}
                    aria-label="Menos"
                  >
                    −
                  </button>
                  <span
                    className="px-3 py-2 small fw-semibold"
                    style={{ minWidth: 48, textAlign: 'center' }}
                  >
                    {effectiveQty}
                  </span>
                  <button
                    type="button"
                    className="store-qty-btn plus"
                    onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
                    disabled={effectiveQty >= maxQty}
                    aria-label="Más"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  className="store-btn-cart-large"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  🛒 AGREGAR AL CARRITO
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-3"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Comprar ahora
                </button>
              </div>
              <div className="d-flex gap-2 small">
                <button type="button" className="btn btn-light rounded-3 btn-sm">
                  ❤️ Favorito
                </button>
                <button type="button" className="btn btn-light rounded-3 btn-sm" onClick={handleShare}>
                  🔗 Compartir
                </button>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-4 pt-3">
            <h2 className="h6 fw-bold mb-3">✨ También te puede interesar</h2>
            <div className="row g-3">
              {related.slice(0, 4).map(p => (
                <div key={p.id} className="col-6 col-md-3">
                  <Link
                    to={`/tienda/${slug}/producto/${p.id}`}
                    className="text-decoration-none text-dark d-block"
                  >
                    <img
                      src={getImageUrlOrDefault(p.imageCoverUrl)}
                      alt={p.name}
                      className="store-related-thumb mb-2"
                    />
                    <p className="small fw-semibold mb-0">{p.name}</p>
                    <p className="small text-muted mb-0">${Number(p.price).toFixed(2)}</p>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <StoreFooter profile={profile} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
