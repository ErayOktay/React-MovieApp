import { Link } from "react-router";
import { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";

export default function Movie({ movieObj }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="col ">
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
              className="card-img-top uniform-poster"
            />
          </Link>
          <div className="card-body ">
            <h2 className="h6 card-title">{movieObj.title}</h2>
          </div>
        </div>
      }
    </div>
  );
}
