import Movie from "./Movie";

export default function MovieGrid({ movies, getSubtitle, onRemove }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <Movie
          key={movie.id}
          movieObj={movie}
          subtitle={getSubtitle?.(movie)}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
