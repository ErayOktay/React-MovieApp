import { useCallback, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import InfiniteMovieGrid from "../components/InfiniteMovieGrid";
import useGenres from "../hooks/useGenres";
import { discoverMovies } from "../services/tmdb";
import { EMPTY_FILTERS, SORT_OPTIONS, toDiscoverParams } from "../utils/filters";

const GENRE_SORTS = ["popularity", "rating", "newest"];

// /genre/:genreId?sort=rating — doğrudan açma ve yenileme URL'den çalışır.
export default function GenrePage() {
  const { genreId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const genres = useGenres();

  const sortParam = searchParams.get("sort");
  const sort = GENRE_SORTS.includes(sortParam) ? sortParam : "popularity";
  const genre = genres.find((g) => String(g.id) === genreId);
  const validId = /^\d+$/.test(genreId);

  const params = useMemo(
    () => toDiscoverParams({ ...EMPTY_FILTERS, genres: [genreId], sort }),
    [genreId, sort]
  );
  const fetchPage = useCallback(
    (page, signal) => discoverMovies(params, page, signal),
    [params]
  );

  if (!validId || (genres.length > 0 && !genre)) {
    return (
      <div className="container-xl py-5 text-center">
        <p className="lead">Aradığınız tür bulunamadı.</p>
        <Link to="/genres" className="btn btn-primary">
          Tüm türler
        </Link>
      </div>
    );
  }

  return (
    <div className="container-xl py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 px-1">
        <h1 className="h3 fw-semibold mb-0">
          {genre ? `${genre.name} Filmleri` : "Tür"}
        </h1>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="genre-sort" className="small text-body-secondary mb-0">
            Sıralama
          </label>
          <select
            id="genre-sort"
            className="form-select form-select-sm w-auto"
            value={sort}
            onChange={(e) => setSearchParams({ sort: e.target.value }, { replace: true })}
          >
            {SORT_OPTIONS.filter((o) => GENRE_SORTS.includes(o.value)).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <Link to={`/search?genre=${genreId}`} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-sliders me-1" aria-hidden="true"></i>Filtrele
          </Link>
        </div>
      </div>

      {genres.length > 0 && (
        <nav aria-label="Türler" className="pill-nav mb-4">
          {genres.map((g) => (
            <Link
              key={g.id}
              to={`/genre/${g.id}`}
              className={`pill-link ${String(g.id) === genreId ? "active" : ""}`}
              aria-current={String(g.id) === genreId ? "page" : undefined}
            >
              {g.name}
            </Link>
          ))}
        </nav>
      )}

      <InfiniteMovieGrid
        key={`${genreId}-${sort}`}
        fetchPage={fetchPage}
        emptyState={
          <p className="text-center text-body-secondary py-5">
            Bu türde film bulunamadı.
          </p>
        }
      />
    </div>
  );
}
