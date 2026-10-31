import MovieGrid from "./MovieGrid";

// Başlıklı, sayfalamasız film listesi (ör. "Benzer Filmler").
export default function MovieList({ movies, title }) {
  return (
    <section className="py-3">
      <h2 className="h3 fw-semibold mb-0 px-1">{title}</h2>
      <hr />
      {movies.length === 0 ? (
        <p className="text-center text-body-secondary py-4 mb-0">
          Film bulunamadı
        </p>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </section>
  );
}
