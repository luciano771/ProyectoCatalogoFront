interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchBar = ({ value, onChange, className }: Props) => {
  return (
    <div className={className ?? 'mb-3'}>
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder="Buscar productos..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;

