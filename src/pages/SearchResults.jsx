import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import InfiniteMovieGrid from "../components/InfiniteMovieGrid";
import FilterPanel from "../components/FilterPanel";
import useDebounce from "../hooks/useDebounce";
import useGenres from "../hooks/useGenres";
import { discoverMovies, searchMovies } from "../services/tmdb";
import {
  EMPTY_FILTERS,
  applyClientFilters,
  countActiveFilters,
  parseFilters,
  serializeFilters,
  sortMovies,
  toDiscoverParams,
} from "../utils/filters";

// /search?q=father&genre=28,12&min_rating=7&year_from=2000&lang=en&sort=rating
// Sorgu yoksa /discover/movie (tüm filtreler sunucuda), sorgu varsa
// /search/movie (TMDB yalnızca sorguyu destekler; filtreler istemcide uygulanır).
function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genres = useGenres();
  const [panelOpen, setPanelOpen] = useState(false);

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const key = serializeFilters(filters); // normalize edilmiş, kararlı anahtar
  const hasQuery = filters.q.trim().length > 0;
  const activeCount = countActiveFilters(filters);

  // Formdaki anlık değerler (draft) ile URL arasında 400 ms gecikmeli eşitleme.
  const [draft, setDraft] = useState(filters);
  const debouncedDraft = useDebounce(draft, 400);
  const writtenKey = useRef(key); // URL'ye en son yazılan/okunan anahtar

  useEffect(() => {
    // URL dışarıdan değiştiyse (navbar araması, geri tuşu...) formu güncelle.
    if (key !== writtenKey.current) {
      writtenKey.current = key;
      setDraft(filters);
    }
  }, [key, filters]);

  useEffect(() => {
    const next = serializeFilters(debouncedDraft);
    if (next !== writtenKey.current) {
      writtenKey.current = next;
      setSearchParams(new URLSearchParams(next), { replace: true });
    }
  }, [debouncedDraft, setSearchParams]);

  const updateDraft = useCallback(
    (patch) => setDraft((current) => ({ ...current, ...patch })),
    []
  );
  const clearFilters = useCallback(
    () => setDraft((current) => ({ ...EMPTY_FILTERS, q: current.q })),
    []
  );
  const closePanel = useCallback(() => setPanelOpen(false), []);

  const fetchPage = useCallback(
    async (page, signal) => {
      if (hasQuery) {
        const data = await searchMovies(filters.q.trim(), page, signal);
        return { ...data, results: applyClientFilters(data.results || [], filters) };
      }
      return discoverMovies(toDiscoverParams(filters), page, signal);
    },
    [filters, hasQuery]
  );

  // Sorgulu aramada sıralama, o ana kadar yüklenen sonuçların tamamına uygulanır.
  const transform = useMemo(
    () => (hasQuery && filters.sort ? (items) => sortMovies(items, filters.sort) : undefined),
    [hasQuery, filters.sort]
  );

  const title = hasQuery ? `Arama Sonuçları: ${filters.q.trim()}` : "Filmleri Keşfet";

  return (
    <div className="container-xl py-4">
      <h1 className="h3 fw-semibold mb-3 px-1">{title}</h1>

      <div className="row g-4">
        <div className="col-lg-3">
          <FilterPanel
            filters={draft}
            genres={genres}
            activeCount={countActiveFilters(draft)}
            open={panelOpen}
            onChange={updateDraft}
            onClear={clearFilters}
            onClose={closePanel}
          />
        </div>

        <div className="col-lg-9">
          <div className="d-flex gap-2 mb-3">
            <div className="input-group">
              <span className="input-group-text" aria-hidden="true">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="search"
                className="form-control"
                placeholder="Film adı yazın..."
                aria-label="Film adı"
                value={draft.q}
                onChange={(e) => updateDraft({ q: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary d-lg-none text-nowrap"
              onClick={() => setPanelOpen(true)}
              aria-expanded={panelOpen}
            >
              <i className="bi bi-sliders me-1" aria-hidden="true"></i>
              Filtreler
              {activeCount > 0 && (
                <span className="badge text-bg-primary ms-1">{activeCount}</span>
              )}
            </button>
          </div>

          {hasQuery && activeCount > 0 && (
            <p className="small text-body-secondary">
              Not: Film adıyla birlikte seçilen filtreler ve sıralama, yüklenen
              sonuçlar üzerinde uygulanır.
            </p>
          )}

          <InfiniteMovieGrid
            key={key}
            fetchPage={fetchPage}
            transform={transform}
            emptyState={
              <div className="text-center py-5">
                <i className="bi bi-film display-4 text-body-secondary" aria-hidden="true"></i>
                <p className="mt-3 mb-3">
                  {hasQuery || activeCount > 0
                    ? "Seçtiğiniz kriterlere uyan film bulunamadı."
                    : "Film bulunamadı."}
                </p>
                {activeCount > 0 && (
                  <button type="button" className="btn btn-outline-primary" onClick={clearFilters}>
                    Filtreleri temizle
                  </button>
                )}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
