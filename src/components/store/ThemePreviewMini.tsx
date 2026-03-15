import { MOCK_STORE_PROFILE, MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../data/mockStoreData';

interface Props {
  themeId: string;
}

/**
 * Mini preview de la tienda con datos mock para mostrar en la card del selector de tema.
 * Se renderiza con data-store-theme para aplicar la identidad visual del tema.
 */
const ThemePreviewMini = ({ themeId }: Props) => {
  const profile = { ...MOCK_STORE_PROFILE, themeId };
  const products = MOCK_PRODUCTS.slice(0, 2);

  return (
    <div
      className="theme-preview-mini rounded-2 overflow-hidden"
      data-store-theme={themeId}
      style={{ minHeight: 100 }}
    >
      <div className="store-gradient-bg h-100 p-2">
        {/* Mini header: barra de color + nombre */}
        <div
          className="rounded-1 mb-2 d-flex align-items-center justify-content-center text-white small fw-semibold overflow-hidden"
          style={{
            height: 28,
            background: `linear-gradient(135deg, var(--store-primary) 0%, var(--store-primary-end) 100%)`
          }}
        >
          {profile.businessName}
        </div>
        {/* Mini categorías */}
        <div className="d-flex gap-1 mb-2 flex-wrap justify-content-center">
          {MOCK_CATEGORIES.slice(0, 2).map(c => (
            <span
              key={c.id}
              className="store-category-pill"
              style={{ padding: '2px 6px', fontSize: 10 }}
            >
              {c.name}
            </span>
          ))}
        </div>
        {/* Mini cards: 2 productos */}
        <div className="d-flex gap-1 justify-content-center">
          {products.map(p => (
            <div
              key={p.id}
              className="store-card flex-grow-1 rounded-1 p-1 text-center"
              style={{ maxWidth: 72 }}
            >
              <div
                className="store-card-img-placeholder bg-light rounded-1 d-flex align-items-center justify-content-center small text-muted"
                style={{ height: 36, fontSize: 8 }}
              >
                img
              </div>
              <div className="small fw-semibold text-truncate mt-1" style={{ fontSize: 9 }}>
                {p.name}
              </div>
              <div className="small" style={{ fontSize: 9, color: 'var(--store-accent)' }}>
                ${Number(p.price).toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemePreviewMini;
