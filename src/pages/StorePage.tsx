import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import { getStoreBySlug } from '../api/store-api';
import { useCart } from '../hooks/useCart';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import StoreHeader from '../components/store/StoreHeader';
import CategoryFilter from '../components/store/CategoryFilter';
import SearchBar from '../components/store/SearchBar';
import ProductGrid from '../components/store/ProductGrid';
import StoreFooter from '../components/store/StoreFooter';

const StorePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { setStoreSlug } = useCart();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | 'all'>('all');

  useEffect(() => {
    if (slug) setStoreSlug(slug);
    return () => setStoreSlug(null);
  }, [slug, setStoreSlug]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['store', slug],
    queryFn: () => getStoreBySlug(slug ?? ''),
    enabled: !!slug
  });

  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('categoria');
  useEffect(() => {
    if (categoryFromUrl && data?.categories.some(c => c.id === categoryFromUrl)) {
      setCategoryId(categoryFromUrl);
    }
  }, [categoryFromUrl, data?.categories]);

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    return data.products.filter(p => {
      if (categoryId !== 'all' && p.categoryId !== categoryId) return false;
      if (
        search &&
        !p.name.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [data, categoryId, search]);

  type SortKey = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  const [sort, setSort] = useState<SortKey>('name_asc');
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sort) {
      case 'price_asc':
        return list.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price_desc':
        return list.sort((a, b) => Number(b.price) - Number(a.price));
      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  }, [filteredProducts, sort]);

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
        <Alert variant="danger">Tienda no encontrada.</Alert>
      </div>
    );
  }

  return (
    <div
      className="store-gradient-bg min-vh-100"
      data-store-theme={data.profile.themeId || 'minimal-clean'}
    >
      <div className="container py-4 px-2 px-md-3">
        <StoreHeader profile={data.profile} />

        <section className="text-center py-3 mb-3">
          <p className="text-muted mb-0 small">
            {data.profile.description || 'Descubre productos increíbles con la mejor experiencia de compra'}
          </p>
        </section>

        <CategoryFilter
          categories={data.categories}
          selected={categoryId}
          onChange={setCategoryId}
        />

        <div id="productos" className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mt-3 mb-3">
          <h2 className="h5 mb-0 fw-bold">Productos Destacados ✨</h2>
          <div className="d-flex flex-wrap align-items-center gap-2 w-100">
            <select
              id="sort-store"
              className="store-ordenar flex-grow-1 flex-md-grow-0"
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
            >
              <option value="name_asc">Nombre A-Z</option>
              <option value="name_desc">Nombre Z-A</option>
              <option value="price_asc">Precio ↑</option>
              <option value="price_desc">Precio ↓</option>
            </select>
            <SearchBar value={search} onChange={setSearch} className="store-search mb-0 flex-grow-1 flex-md-grow-0" />
          </div>
        </div>

        <ProductGrid
          products={sortedProducts}
          profile={data.profile}
          categories={data.categories}
        />

        <StoreFooter profile={data.profile} />
      </div>
    </div>
  );
};

export default StorePage;

