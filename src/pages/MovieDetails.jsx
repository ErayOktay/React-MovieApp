import React, { useEffect, useState, useCallback, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router";
import Loading from "../components/Loading";
import SimilarMovies from "./SimilarMovies";
import { UserContext } from "../contexts/UserContext";
import {
  getMovieDetails,
  getMovieCredits,
  imageUrl,
} from "../services/tmdb";

const CAST_LIMIT = 12;

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
    if (!id) return;
    const controller = new AbortController();

    async function fetchMovieDetails() {
      setLoading(true);
      setMovie(null);
      try {
        const [details, credits] = await Promise.all([
          getMovieDetails(id, controller.signal),
          getMovieCredits(id, controller.signal),
        ]);
        setMovie(details);
        setCast(credits.cast?.slice(0, CAST_LIMIT) || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Film detayları yüklenemedi:", err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchMovieDetails();
    return () => controller.abort();
  }, [id]);

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
  const posterUrl = imageUrl(poster_path, "w500");
  const backdropUrl = imageUrl(backdrop_path, "w1280");

  const formatRuntime = (minutes) => {
    if (!minutes) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}sa ${m}dk` : `${m}dk`;
  };

  return (
    <>
      <div
        className="text-white position-relative w-100 movie-detail-page"
        style={{ backgroundColor: "#141414" }}
      >
        {/* Backdrop + Gradient */}
        {backdropUrl && (
          <div
            className="movie-backdrop"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          ></div>
        )}

        <div className="movie-backdrop-overlay"></div>

        {/* İçerik */}
        <div className="position-relative container-fluid py-5 px-3 px-md-5">
          {/* Geri butonu */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline-light btn-sm rounded-pill px-4 position-absolute top-0 end-0 mt-3 me-3 z-3"
          >
            ← Geri Dön
          </button>

          <div className="row g-4 g-lg-5 align-items-start">
            {/* Poster */}
            <div className="col-lg-4 col-xl-3 text-center text-lg-start">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`${title} afişi`}
                  className="movie-detail-poster img-fluid"
                />
              ) : (
                <div
                  className="movie-detail-poster movie-poster-fallback"
                  role="img"
                  aria-label="Afiş yok"
                >
                  <i className="bi bi-film" aria-hidden="true"></i>
                </div>
              )}
            </div>

            {/* Bilgiler */}
            <div className="col-lg-8 col-xl-9 ps-lg-4">
              <h1 className="display-5 fw-bold mb-2">{title}</h1>
              {original_title && original_title !== title && (
                <p className="text-secondary mb-3">({original_title})</p>
              )}

              <div className="d-flex flex-wrap gap-2 gap-md-3 align-items-center mb-4">
                <span className="bg-danger px-3 py-1 rounded fw-bold small">
                  {year}
                </span>
                {genres.map((g) => (
                  <Link
                    key={g.id}
                    to={`/genre/${g.id}`}
                    className="genre-badge"
                    aria-label={`${g.name} türündeki filmleri gör`}
                  >
                    {g.name}
                  </Link>
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

                <button
                  type="button"
                  className="btn btn-danger fs-5 ms-2 px-3 py-1"
                  onClick={() =>
                    isAddedToWatchList
                      ? removeFromWatchList(movie)
                      : addToWatchList(movie)
                  }
                  aria-pressed={Boolean(isAddedToWatchList)}
                  aria-label={
                    isAddedToWatchList
                      ? "İzlenecekler listesinden çıkar"
                      : "İzlenecekler listesine ekle"
                  }
                >
                  <i
                    className={`bi ${
                      isAddedToWatchList ? "bi-heart-fill" : "bi-heart"
                    }`}
                  ></i>
                </button>
              </div>

              {tagline && (
                <p className="fst-italic fs-5 fs-md-4 text-light mb-4 opacity-90">
                  "{tagline}"
                </p>
              )}

              <h2 className="h3 fw-bold mb-3">Özet</h2>
              <p className="fs-6 fs-md-5 lh-lg text-light mb-4">
                {overview || "Özet bulunamadı."}
              </p>
            </div>
          </div>

          {/* Oyuncular */}
          {cast.length > 0 && (
            <section className="mt-5 pt-4 border-top border-secondary border-opacity-25">
              <h2 className="h3 fw-bold mb-4">Başroller</h2>
              <ul className="cast-grid list-unstyled mb-0">
                {cast.map((actor) => {
                  const photo = imageUrl(actor.profile_path, "w185");
                  return (
                    <li key={actor.credit_id}>
                      <Link
                        to={`/person/${actor.id}`}
                        className="cast-card"
                        aria-label={`${actor.name}, ${actor.character || "rol bilgisi yok"} — oyuncu sayfası`}
                      >
                        {photo ? (
                          <img
                            src={photo}
                            alt=""
                            className="actor-photo mb-2"
                            loading="lazy"
                          />
                        ) : (
                          <div className="actor-photo actor-photo-fallback mb-2" aria-hidden="true">
                            <i className="bi bi-person-fill"></i>
                          </div>
                        )}
                        <p className="mb-0 small fw-semibold text-truncate">
                          {actor.name}
                        </p>
                        <p className="text-secondary small text-truncate mb-0">
                          {actor.character}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </div>
      <SimilarMovies movieId={id} />
    </>
  );
}
