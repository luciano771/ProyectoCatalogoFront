import type { PublicCategory } from '../../api/store-api';

interface Props {
  categories: PublicCategory[];
  selected: string | 'all';
  onChange: (value: string | 'all') => void;
}

const CategoryFilter = ({ categories, selected, onChange }: Props) => {
  return (
    <div className="d-flex flex-wrap gap-2 mb-0">
      <button
        type="button"
        className={`store-category-pill ${selected === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
      >
        ✨ Todos
      </button>
      {categories.map(c => (
        <button
          key={c.id}
          type="button"
          className={`store-category-pill ${selected === c.id ? 'active' : ''}`}
          onClick={() => onChange(c.id)}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

