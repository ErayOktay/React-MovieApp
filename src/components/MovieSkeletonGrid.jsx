// Yüklenirken gösterilen iskelet kartlar.
export default function MovieSkeletonGrid({ count = 12 }) {
  return (
    <div className="movie-grid" aria-busy="true">
      <span className="visually-hidden" role="status">
        Filmler yükleniyor...
      </span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="movie-card card h-100" aria-hidden="true">
          <div className="movie-poster-wrap skeleton"></div>
          <div className="card-body p-2 p-sm-3">
            <div className="skeleton skeleton-line mb-2"></div>
            <div className="skeleton skeleton-line skeleton-line-short"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
