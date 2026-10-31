import { useEffect } from "react";
import { LANGUAGES, SORT_OPTIONS } from "../utils/filters";

// Filtre paneli: geniş ekranda yan sütun, dar ekranda soldan açılan çekmece.
export default function FilterPanel({
  filters,
  genres,
  activeCount,
  open,
  onChange,
  onClear,
  onClose,
}) {
  // Çekmece açıkken Escape ile kapanır ve arka plan kaydırılmaz (yalnızca mobilde).
  useEffect(() => {
    if (!open) return;
    const isDrawer = window.matchMedia("(max-width: 991.98px)").matches;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    if (isDrawer) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const toggleGenre = (id) => {
    const idStr = String(id);
    const next = filters.genres.includes(idStr)
      ? filters.genres.filter((g) => g !== idStr)
      : [...filters.genres, idStr];
    onChange({ genres: next });
  };

  const field = (name) => ({
    value: filters[name],
    onChange: (e) => onChange({ [name]: e.target.value }),
  });

  return (
    <>
      {open && <div className="filter-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`filter-panel ${open ? "is-open" : ""}`}
        aria-label="Film filtreleri"
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 mb-0">
            Filtreler
            {activeCount > 0 && (
              <span className="badge text-bg-primary ms-2">{activeCount}</span>
            )}
          </h2>
          <button
            type="button"
            className="btn-close d-lg-none"
            onClick={onClose}
            aria-label="Filtreleri kapat"
          ></button>
        </div>

        <fieldset className="filter-group">
          <legend className="filter-legend">Türler</legend>
          {genres.length === 0 ? (
            <p className="small text-body-secondary mb-0">Türler yükleniyor...</p>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {genres.map((g) => {
                const active = filters.genres.includes(String(g.id));
                return (
                  <button
                    key={g.id}
                    type="button"
                    className={`genre-chip ${active ? "active" : ""}`}
                    aria-pressed={active}
                    onClick={() => toggleGenre(g.id)}
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>
          )}
        </fieldset>

        <fieldset className="filter-group">
          <legend className="filter-legend">Puan (0–10)</legend>
          <div className="row g-2">
            <div className="col-6">
              <label htmlFor="f-min-rating" className="form-label small mb-1">En az</label>
              <input id="f-min-rating" type="number" inputMode="decimal" min="0" max="10" step="0.5" className="form-control" placeholder="0" {...field("minRating")} />
            </div>
            <div className="col-6">
              <label htmlFor="f-max-rating" className="form-label small mb-1">En çok</label>
              <input id="f-max-rating" type="number" inputMode="decimal" min="0" max="10" step="0.5" className="form-control" placeholder="10" {...field("maxRating")} />
            </div>
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend className="filter-legend">Yayın yılı</legend>
          <div className="row g-2">
            <div className="col-6">
              <label htmlFor="f-year-from" className="form-label small mb-1">Başlangıç</label>
              <input id="f-year-from" type="number" inputMode="numeric" min="1874" max="2100" className="form-control" placeholder="1990" {...field("yearFrom")} />
            </div>
            <div className="col-6">
              <label htmlFor="f-year-to" className="form-label small mb-1">Bitiş</label>
              <input id="f-year-to" type="number" inputMode="numeric" min="1874" max="2100" className="form-control" placeholder="2025" {...field("yearTo")} />
            </div>
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend className="filter-legend">Yayın tarihi aralığı</legend>
          <div className="row g-2">
            <div className="col-6">
              <label htmlFor="f-date-from" className="form-label small mb-1">Şu tarihten</label>
              <input id="f-date-from" type="date" className="form-control" {...field("dateFrom")} />
            </div>
            <div className="col-6">
              <label htmlFor="f-date-to" className="form-label small mb-1">Şu tarihe</label>
              <input id="f-date-to" type="date" className="form-control" {...field("dateTo")} />
            </div>
          </div>
          <p className="form-text mb-0">Tarih seçilirse yıl aralığının yerine geçer.</p>
        </fieldset>

        <div className="filter-group">
          <label htmlFor="f-lang" className="filter-legend d-block">Orijinal dil</label>
          <select id="f-lang" className="form-select" {...field("lang")}>
            <option value="">Tümü</option>
            {LANGUAGES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="f-sort" className="filter-legend d-block">Sıralama</label>
          <select id="f-sort" className="form-select" {...field("sort")}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="d-flex gap-2 filter-actions">
          <button
            type="button"
            className="btn btn-outline-secondary flex-grow-1"
            onClick={onClear}
            disabled={activeCount === 0}
          >
            Filtreleri temizle
          </button>
          <button type="button" className="btn btn-primary flex-grow-1 d-lg-none" onClick={onClose}>
            Sonuçları göster
          </button>
        </div>
      </aside>
    </>
  );
}
