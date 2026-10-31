import { Link } from "react-router";
import CategoryTabs from "../components/CategoryTabs";
import useGenres from "../hooks/useGenres";

export default function GenresPage() {
  const genres = useGenres();

  return (
    <div className="container-xl py-4">
      <h1 className="h3 fw-semibold mb-3 px-1">Türler</h1>
      <CategoryTabs />
      {genres.length === 0 ? (
        <div className="d-flex justify-content-center py-5" role="status">
          <div className="spinner-border text-primary" aria-hidden="true"></div>
          <span className="visually-hidden">Türler yükleniyor...</span>
        </div>
      ) : (
        <ul className="genre-tiles list-unstyled">
          {genres.map((g) => (
            <li key={g.id}>
              <Link to={`/genre/${g.id}`} className="genre-tile">
                {g.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
