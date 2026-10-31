import React, { useState } from "react";
import { useNavigate } from "react-router";

function SearchForm({ className = "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`); // navigate sayfanın yeniden yüklenmesini önler
      setSearchQuery("");
    }
  }

  return (
    <form className={`search-form ${className}`} role="search" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="search"
          className="form-control"
          placeholder="Film ara..."
          aria-label="Film ara"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="btn btn-outline-light input-group-text"
          type="submit"
          aria-label="Ara"
        >
          <i className="bi bi-search fs-6"></i>
        </button>
      </div>
    </form>
  );
}

export default SearchForm;
