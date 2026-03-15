import type { PublicProduct, PublicMerchantProfile } from '../../api/store-api';
import { getImageUrlOrDefault } from '../../utils/imageUrl';
import { useCart } from '../../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  product: PublicProduct;
  profile: PublicMerchantProfile;
  categoryName?: string | null;
}

const ProductCard = ({ product, profile, categoryName }: Props) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addItem(profile.slug, product.id, 1);
  };

  const handleBuyNow = () => {
    addItem(profile.slug, product.id, 1);
    navigate(`/checkout?store=${encodeURIComponent(profile.slug)}`, {
      state: { slug: profile.slug }
    });
  };

  const productUrl = `/tienda/${profile.slug}/producto/${product.id}`;
  const descriptionSnippet = product.description
    ? product.description.length > 80
      ? `${product.description.slice(0, 80)}...`
      : product.description
    : null;

  return (
    <div className="store-card store-product-card h-100 d-flex flex-column">
      <Link to={productUrl} className="store-card-img-wrap text-decoration-none d-block">
        <img
          src={getImageUrlOrDefault(product.imageCoverUrl)}
          className="store-card-img"
          alt={product.name}
        />
      </Link>
      <div className="card-body d-flex flex-column flex-grow-1 p-3">
        <div className="small text-warning mb-1" title="Valoración">
          ★★★★★ <span className="text-muted">(—)</span>
        </div>
        <h5 className="h6 mb-1 fw-bold">
          <Link to={productUrl} className="text-dark text-decoration-none">
            {product.name}
          </Link>
        </h5>
        {descriptionSnippet && (
          <p className="small text-muted mb-2" style={{ lineHeight: 1.4 }}>
            {descriptionSnippet}
          </p>
        )}
        <div className="d-flex align-items-center justify-content-between gap-2 mb-2 mt-auto">
          <span className="fw-bold text-dark">${Number(product.price).toFixed(2)}</span>
          <button
            type="button"
            className="store-add-btn"
            onClick={handleAddToCart}
            title="Agregar al carrito"
            aria-label="Agregar al carrito"
          >
            +
          </button>
        </div>
        <div className="d-flex align-items-center gap-2 small text-muted flex-wrap">
          {product.stock != null && product.stock > 0 && (
            <span>
              <span className="store-stock-dot" aria-hidden />
              Stock
            </span>
          )}
          <span>⚡ Envío Express</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

