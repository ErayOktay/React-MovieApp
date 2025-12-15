import Movie from "./Movie";
import { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";
import Pagination from "./Pagination"; // Pagination bileşenini import et

export default function MovieList({
  movies,
  title,
  showHeaderPagination = false, // Yeni prop: sadece istenirse sağda pagination göster
  page,
  query,
  setSearchParams,
  totalPages,
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="py-3">
      <div
        className={`card-header bg-${theme} ${
          theme === "dark" ? "text-white" : "text-dark"
        }`}
        data-bs-theme={theme}
      >
        <div className="d-flex justify-content-between align-items-center mx-3">
          <h3 className="fw-semibold mb-0">{title}</h3>

          {showHeaderPagination && totalPages > 1 && (
            <Pagination
              page={page}
              query={query}
              setSearchParams={setSearchParams}
              totalPages={totalPages}
              variant="small"
              className="small-pagination"
            />
          )}
        </div>

        <hr className={theme === "dark" ? "border-white" : "border-dark"} />
      </div>

      {movies.length === 0 ? (
        <div
          className={`text-center bg-${theme} text-muted py-4 fs-6 ${
            theme === "dark" ? "text-white" : "text-dark"
          }`}
          data-bs-theme={theme}
        >
          Film bulunamadı
        </div>
      ) : (
        <div
          id="movie-list"
          className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3 g-md-4"
        >
          {movies
            .filter((movie) => movie.poster_path)
            .map((movie) => (
              <div key={movie.id} className="col">
                <div className="card h-100 border-0 shadow-sm rounded-3">
                  <Movie movieObj={movie} />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
