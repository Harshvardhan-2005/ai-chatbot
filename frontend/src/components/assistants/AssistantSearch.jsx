import { Search } from "lucide-react";

function AssistantSearch({ value, onChange, disabled = false }) {
  return (
    <div className="assistant-search">
      <Search className="assistant-search__icon" size={18} aria-hidden="true" />

      <input
        type="search"
        className="assistant-search__input"
        placeholder="Search assistants..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-label="Search assistants"
      />
    </div>
  );
}

export default AssistantSearch;
