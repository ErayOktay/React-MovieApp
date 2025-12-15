import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import Loading from "../components/Loading";
import SimilarMovies from "./SimilarMovies";
import Footer from "../components/Footer";
import { UserContext } from "../contexts/UserContext";

const api_key = "38b433bd7b3d5056ece6f0bb98fa260d";
const language = "tr-TR";
const apiUrl = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p";
const DEFAULT_POSTER = "https://via.placeholder.com/500x750?text=No+Image";
const DEFAULT_BACKDROP =
  "https://via.placeholder.com/1280x720?text=No+Backdrop";
const DEFAULT_PROFILE = "https://via.placeholder.com/185x278?text=No+Photo";

export default function MovieDetails() {
  const { id } = useParams(); // URL'den film id'sini alıyoruz
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToWatchList, watchList, removeFromWatchList } =
    useContext(UserContext);
  const isAddedToWatchList = watchList?.find((i) => i.id == movie?.id);

  // Escape tuşu ile geri dön
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") navigate("/movies");
    },
    [navigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Film detaylarını ve oyuncuları çek
  useEffect(() => {
    async function fetchMovieDetails() {
      if (!id) return;

      setLoading(true);
      try {
        const [detailsRes, creditsRes] = await Promise.all([
          fetch(
            `${apiUrl}/movie/${id}?api_key=${api_key}&language=${language}`
          ),
          fetch(
            `${apiUrl}/movie/${id}/credits?api_key=${api_key}&language=${language}`
          ),
        ]);

        if (!detailsRes.ok || !creditsRes.ok) throw new Error("API hatası");

        const details = await detailsRes.json();
        const credits = await creditsRes.json();

        setMovie(details);
        setCast(credits.cast?.slice(0, 10) || []);
      } catch (err) {
        console.error("Film detayları yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

  // Yüklenememe durumu
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-black text-white">
        <Loading />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-black text-white">
        <p>Film bilgileri yüklenemedi...</p>
      </div>
    );
  }

  const {
    title,
    original_title,
    poster_path,
    backdrop_path,
    release_date,
    vote_average = 0,
    vote_count = 0,
    overview,
    genres = [],
    runtime = 0,
    tagline,
    production_countries = [],
  } = movie;

  const year = release_date ? new Date(release_date).getFullYear() : "—";
  const posterUrl = poster_path
    ? `${IMG_BASE_URL}/w500${poster_path}`
    : DEFAULT_POSTER;
  const backdropUrl = backdrop_path
    ? `${IMG_BASE_URL}/w1280${backdrop_path}`
    : DEFAULT_BACKDROP;

  const formatRuntime = (minutes) => {
    if (!minutes) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}sa ${m}dk` : `${m}dk`;
  };

  return (
    <>
      <div
        className="text-white position-relative w-100"
        style={{ minHeight: "100vh", backgroundColor: "#141414" }}
      >
        {/* Backdrop + Gradient */}
        <div
          className="movie-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        ></div>

        <div className="movie-backdrop-overlay"></div>

        {/* İçerik */}
        <div className="position-relative container-fluid py-5 px-4 px-md-5">
          {/* Geri butonu */}
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-light btn-sm rounded-pill px-4 position-absolute top-0 end-0 mt-3 me-3 z-3"
          >
            ← Geri Dön
          </button>

          {loading && <Loading />}

          <div className="row g-5 align-items-start">
            {/* Poster */}
            <div className="col-lg-4 col-xl-3 text-center text-lg-start">
              <img
                src={posterUrl}
                alt={title}
                className="movie-detail-poster img-fluid"
              />
            </div>

            {/* Bilgiler */}
            <div className="col-lg-8 col-xl-9 ps-4 ps-md-5">
              <h1 className="display-5 fw-bold mb-2">{title}</h1>
              {original_title && original_title !== title && (
                <p className="text-secondary mb-3">({original_title})</p>
              )}

              <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
                <span className="bg-danger px-3 py-1 rounded fw-bold small">
                  {year}
                </span>
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className="bg-dark border border-secondary px-3 py-1 rounded small"
                  >
                    {g.name}
                  </span>
                ))}
                {production_countries.length > 0 && (
                  <span className="bg-dark border border-secondary px-3 py-1 rounded small">
                    <i
                      className={`fi fi-${production_countries[0].iso_3166_1.toLowerCase()} fis me-1`}
                    ></i>
                    {production_countries[0].name}
                  </span>
                )}
                <span className="badge bg-secondary fs-6 px-3 py-2">
                  {formatRuntime(runtime)}
                </span>
              </div>

              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className={`tmdb-score-circle ${
                    vote_average >= 7
                      ? "score-green"
                      : vote_average >= 4
                      ? "score-orange"
                      : "score-red"
                  }`}
                >
                  {vote_average.toFixed(1)}
                </div>
                <div className="text-secondary">
                  {vote_count.toLocaleString("tr-TR")} oy
                </div>

                {isAddedToWatchList ? (
                  <span
                    className="badge bg-danger fs-5 ms-2 pointer"
                    onClick={() => removeFromWatchList(movie)}
                  >
                    <i className="bi bi-heart-fill"></i>
                  </span>
                ) : (
                  <span
                    className="badge bg-danger fs-5 ms-2 pointer"
                    onClick={() => addToWatchList(movie)}
                  >
                    <i className="bi bi-heart"></i>
                  </span>
                )}
              </div>

              {tagline && (
                <p className="fst-italic fs-4 text-light mb-5 opacity-90">
                  "{tagline}"
                </p>
              )}

              <h3 className="fw-bold mb-3">Özet</h3>
              <p className="fs-5 lh-lg text-light mb-5">
                {overview || "Özet bulunamadı."}
              </p>
            </div>
          </div>

          {/* Oyuncular */}
          {cast.length > 0 && (
            <div className="mt-5 pt-4 border-top border-secondary border-opacity-25">
              <h3 className="fw-bold mb-4">Başroller</h3>
              <div className="row g-3 g-md-4">
                {cast
                  .filter((actor) => actor.profile_path) // Sadece fotoğrafı olanları al
                  .map((actor) => (
                    <div
                      key={actor.cast_id}
                      className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1"
                    >
                      <div className="text-center">
                        <img
                          src={
                            actor.profile_path
                              ? `${IMG_BASE_URL}/w154${actor.profile_path}`
                              : DEFAULT_PROFILE
                          }
                          alt={actor.name}
                          className="actor-photo mb-2"
                        />
                        <p className="mb-0 small fw-600 text-truncate">
                          {actor.name}
                        </p>
                        <p className="text-secondary small text-truncate">
                          {actor.character}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <SimilarMovies movieId={id} />
      <Footer />
    </>
  );
}
