import { useContext } from "react";
import WatchListMovie from "./WatchListMovie";
import ThemeContext from "../contexts/ThemeContext";
import Footer from "./Footer";

export default function WatchList({ movies, removeFromWatchList, title }) {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      {
        <div className="py-3 container">
          <div
            className={`card-header bg-${theme} ${
              theme === "dark" ? "text-white" : "text-dark"
            } `}
            data-bs-theme={theme}
          >
            <h3 className="mx-3 fw-semibold">{title}</h3>
            <hr className={theme === "dark" ? "border-white" : "border-dark"} />
          </div>
          <div className="card-body">
            {movies.length == 0 ? ( // is_active film yoksa burayı getir
              <div
                className={` bg-${theme} ${
                  theme === "dark" ? "text-white" : "text-dark"
                } `}
                data-bs-theme={theme}
              >
                Film bulunamadı
              </div>
            ) : (
              // varsa burayı
              <div
                id="movie-list"
                className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3 g-md-4"
              >
                {movies.map((m, index) => (
                  <WatchListMovie
                    key={index}
                    movieObj={m}
                    removeFromWatchList={removeFromWatchList}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      }
      <Footer />
    </>
  );
}
