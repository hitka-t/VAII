function SearchBar({ filterText, setFilterText, filterStav, setFilterStav }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Hľadať podľa brandu alebo typu..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <select
        value={filterStav}
        onChange={(e) => setFilterStav(e.target.value)}
      >
        <option value="vsetko">Všetko</option>
        <option value="OK">Len OK</option>
        <option value="servis">Len servis</option>
      </select>
    </div>
  );
}

export default SearchBar;
