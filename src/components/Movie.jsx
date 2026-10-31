import { Link } from "react-router";
import { imageUrl } from "../services/tmdb";

// Tek film kartı. Kartın tamamı detay sayfasına giden bir bağlantıdır.
// `subtitle` (ör. oyuncunun canlandırdığı karakter) ve `onRemove` isteğe bağlıdır.
export default function Movie({ movieObj, subtitle, onRemove }) {
  const { id, title, poster_path, release_date, vote_average } = movieObj;
  const poster = imageUrl(poster_path, "w342");
  const year = release_date ? release_date.slice(0, 4) : "";

  return (
    <article className="movie-card card h-100 position-relative">
      <div className="movie-poster-wrap">
        {poster ? (
          <img
            src={poster}
            alt={`${title} afişi`}
            className="movie-poster"
            loading="lazy"
            width="342"
            height="513"
          />
        ) : (
          <div className="movie-poster movie-poster-fallback" aria-hidden="true">
            <i className="bi bi-film"></i>
          </div>
        )}
        {vote_average > 0 && (
          <span className="movie-rating" title="TMDB puanı">
            <i className="bi bi-star-fill" aria-hidden="true"></i>{" "}
            <span className="visually-hidden">Puan:</span>
            {vote_average.toFixed(1)}
          </span>
        )}
      </div>

      <div className="card-body p-2 p-sm-3">
        <h3 className="h6 card-title movie-title mb-1">
          <Link
            to={`/movies/${id}`}
            className="stretched-link text-reset text-decoration-none"
          >
            {title}
          </Link>
        </h3>
        {(year || subtitle) && (
          <p className="small text-body-secondary mb-0 movie-meta">
            {[year, subtitle].filter(Boolean).join(" • ")}
          </p>
        )}
      </div>

      {onRemove && (
        <button
          type="button"
          className="btn btn-danger btn-sm rounded-circle poster-remove-btn"
          onClick={() => onRemove(movieObj)}
          title="Watchlist'ten kaldır"
          aria-label={`${title} filmini watchlist'ten kaldır`}
        >
          <i className="bi bi-x"></i>
        </button>
      )}
    </article>
  );
}
