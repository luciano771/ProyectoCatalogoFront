import { useMemo, useState } from 'react';
import {
  STORE_THEMES,
  STYLE_FILTER_OPTIONS,
  type StoreTheme,
  type ThemeStyleFilter
} from '../../config/storeThemes';
import ThemePreviewMini from '../store/ThemePreviewMini';

interface Props {
  value: string;
  onChange: (themeId: string) => void;
  disabled?: boolean;
}

const ThemeSelector = ({ value, onChange, disabled }: Props) => {
  const [styleFilter, setStyleFilter] = useState<ThemeStyleFilter | 'todos'>('todos');

  const filteredThemes = useMemo(() => {
    if (styleFilter === 'todos') return STORE_THEMES;
    return STORE_THEMES.filter(t => t.style === styleFilter);
  }, [styleFilter]);

  const handleSelect = (theme: StoreTheme) => {
    if (disabled) return;
    onChange(theme.id);
  };

  return (
    <div className="theme-selector">
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <label className="small text-muted mb-0 me-2">Estilo:</label>
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 180 }}
          value={styleFilter}
          onChange={e => setStyleFilter(e.target.value as ThemeStyleFilter | 'todos')}
        >
          <option value="todos">Todos</option>
          {STYLE_FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="row g-3">
        {filteredThemes.map(theme => {
          const selected = value === theme.id;
          return (
            <div key={theme.id} className="col-12 col-sm-6 col-lg-4">
              <label
                className={`theme-selector-card d-block border rounded-3 p-3 text-decoration-none cursor-pointer transition ${selected ? 'theme-selector-card--selected' : ''}`}
                style={{ cursor: disabled ? 'default' : 'pointer' }}
                onClick={() => handleSelect(theme)}
              >
                <input
                  type="radio"
                  name="themeId"
                  value={theme.id}
                  checked={selected}
                  onChange={() => handleSelect(theme)}
                  className="visually-hidden"
                  disabled={disabled}
                />

                <div className="theme-preview-mini-wrap position-relative rounded-2 overflow-hidden mb-3">
                  {theme.badge && (
                    <span className={`theme-selector-badge theme-selector-badge--${theme.badge}`}>
                      {theme.badge === 'popular' ? 'Popular' : 'Nuevo'}
                    </span>
                  )}
                  {selected && (
                    <span className="theme-selector-check" aria-hidden>
                      ✓
                    </span>
                  )}
                  <ThemePreviewMini themeId={theme.id} />
                </div>

                <div className="d-flex align-items-center gap-2 mb-1">
                  <span
                    className="rounded-circle border"
                    style={{ width: 14, height: 14, backgroundColor: theme.swatches[0] }}
                  />
                  <span
                    className="rounded-circle border"
                    style={{ width: 14, height: 14, backgroundColor: theme.swatches[1] }}
                  />
                  <span className="small fw-semibold">{theme.name}</span>
                </div>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.35 }}>
                  {theme.description}
                </p>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;
