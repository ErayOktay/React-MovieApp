import React, { use, useState } from "react";
import { useNavigate } from "react-router";

function SearchForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`); // navigate sayfada query aratıldığında sayfanın resetlenmemesini sağlar
      setSearchQuery("");
    }
  }

  return (
    <>
      <div className="ms-auto py-1">
        <form className="d-flex" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="search"
              className="form-control border"
              placeholder="Film ara..."
              aria-label="Film ara"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="btn btn-outline-light input-group-text border"
              type="submit"
            >
              <i className="bi bi-search fs-6"></i>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SearchForm;

// ms-auto otomatik sağa yaslar me-auto ise sola yaslar
