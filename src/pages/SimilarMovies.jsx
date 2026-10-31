import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import MovieList from "../components/MovieList";
import { getSimilarMovies } from "../services/tmdb";

function SimilarMovies({ movieId }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    getSimilarMovies(movieId, controller.signal)
      .then((data) => setMovies(data.results || []))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [movieId]);

  return (
    <div className="container-xl py-4">
      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-body-secondary text-center mb-0">
          Benzer filmler yüklenemedi.
        </p>
      ) : (
        <MovieList movies={movies} title="Benzer Filmler" />
      )}
    </div>
  );
}

export default SimilarMovies;
