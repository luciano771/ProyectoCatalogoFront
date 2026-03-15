import type { PublicProduct, PublicMerchantProfile, PublicCategory } from '../../api/store-api';
import ProductCard from './ProductCard';

interface Props {
  products: PublicProduct[];
  profile: PublicMerchantProfile;
  categories?: PublicCategory[];
}

const ProductGrid = ({ products, profile, categories = [] }: Props) => {
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  if (!products.length) {
    return (
      <p className="text-muted small">
        No hay productos disponibles en este momento.
      </p>
    );
  }

  return (
    <div className="row g-4">
      {products.map(product => (
        <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <ProductCard
            product={product}
            profile={profile}
            categoryName={product.categoryId ? categoryMap.get(product.categoryId) ?? null : null}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;

