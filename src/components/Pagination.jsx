import React from "react";
import { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Pagination({ page, totalPages, setSearchParams, query }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`card bg-${theme} border-0`} data-bs-theme={theme}>
      <div className="container py-3">
        <div className="d-flex justify-content-center align-items-center gap-3">
          <button
            className={`btn rounded-pill d-flex align-items-center gap-2 pagination-btn ${
              theme === "dark" ? "btn-outline-light" : "btn-light"
            }`}
            onClick={() =>
              setSearchParams({ q: query, page: Number(page) - 1 })
            }
            disabled={page <= 1}
          >
            <FaArrowLeft /> Geri
          </button>

          <span
            className={`fw-medium ${
              theme === "dark" ? "text-light" : "text-secondary"
            }`}
          >
            {page} / {totalPages}
          </span>

          <button
            className={`btn rounded-pill d-flex align-items-center gap-2 pagination-btn ${
              theme === "dark" ? "btn-outline-light" : "btn-light"
            }`}
            onClick={() =>
              setSearchParams({ q: query, page: Number(page) + 1 })
            }
            disabled={page >= totalPages}
          >
            İleri <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
