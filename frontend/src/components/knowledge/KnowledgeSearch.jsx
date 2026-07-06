import { Search } from "lucide-react";

function KnowledgeSearch({ value, onChange, disabled = false }) {
  return (
    <div className="knowledge-search">
      <Search className="knowledge-search__icon" size={18} aria-hidden="true" />

      <input
        type="search"
        className="knowledge-search__input"
        placeholder="Search knowledge sources..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-label="Search knowledge sources"
      />
    </div>
  );
}

export default KnowledgeSearch;
