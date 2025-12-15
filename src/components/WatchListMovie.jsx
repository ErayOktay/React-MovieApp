import { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";
import { Link } from "react-router";

export default function WatchListMovie({ movieObj, removeFromWatchList }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="col">
      {
        <div
          className={`card bg-${theme} movie position-relative h-100`}
          style={{ cursor: "pointer" }}
          data-bs-theme={theme}
        >
          <Link
            to={`/movies/${movieObj.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src={
                "https://image.tmdb.org/t/p/original/" + movieObj.poster_path
              }
              alt=""
              className="card-img-top" // img-fluid rounded might be
            />
          </Link>
          <div className="card-body">
            <h2 className="h6 card-title">{movieObj.title}</h2>
            <button
              className="btn btn-danger btn-sm rounded-circle
             position-absolute top-0 start-0 m-2
             poster-remove-btn"
              onClick={() => removeFromWatchList(movieObj)}
              title="Watchlist'ten kaldır"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      }
    </div>
  );
}
