import MovieGrid from "./MovieGrid";

export default function WatchList({ movies, removeFromWatchList, title }) {
  return (
    <div className="py-4 container-xl">
      <h1 className="h3 fw-semibold px-1 mb-0">{title}</h1>
      <hr />
      {movies.length === 0 ? (
        <p className="text-body-secondary">Film bulunamadı</p>
      ) : (
        <MovieGrid movies={movies} onRemove={removeFromWatchList} />
      )}
    </div>
  );
}
