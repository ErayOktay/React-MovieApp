import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import MovieList from "../components/MovieList";

const apiUrl = "https://api.themoviedb.org/3";
const api_key = "38b433bd7b3d5056ece6f0bb98fa260d";
const page = 1;
const language = "tr-TR";

function SimilarMovies({ movieId }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getMovies() {
      const loading = true;
      setLoading(loading);

      try {
        const response = await fetch(
          `${apiUrl}/movie/${movieId}/similar?api_key=${api_key}&language=${language}&page=${page}&append_to_response=credits`
        );

        if (response.status === 401) {
          throw new Error(
            "Uygulamada bir yetkilendirme sorunu var. Kısa süre içinde düzeltilecektir."
          );
        } else if (response.status === 404) {
          throw new Error(
            "Sunucu adresi geçici olarak bulunamıyor. Lütfen daha sonra tekrar deneyin."
          );
        } else if (response.status === 429) {
          throw new Error(
            "Sunucu şu anda yoğun. Birkaç saniye sonra tekrar deneyin."
          );
        } else if (response.status >= 500) {
          throw new Error(
            "Sunucuda geçici bir sorun var. Lütfen biraz sonra tekrar deneyin."
          );
        } else if (!response.ok) {
          throw new Error(
            "Bağlantı kurulurken bir sorun oluştu. Lütfen daha sonra tekrar deneyin."
          );
        }

        const data = await response.json();

        setMovies(data.results || []);
        setError("");
      } catch (error) {
        if (error.message.includes("ERR_NAME_NOT_RESOLVED")) {
          setError(
            "Sunucu adresine ulaşılamıyor. Uygulama kısa süre içinde düzeltilecektir."
          );
        } else if (!navigator.onLine) {
          setError(
            "İnternet bağlantınız yok. Lütfen Wi-Fi veya mobil verinizi kontrol edin."
          );
        } else if (
          error.name === "TypeError" &&
          error.message.includes("Failed to fetch")
        ) {
          setError("Sunucuya bağlantı kurulamadı.");
        } else {
          setError(
            error.message ||
              "Bir hata oluştu. Lütfen daha sonra tekrar deneyin."
          );
        }
      }
      setLoading(false);
    }

    getMovies();
  }, [movieId]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return <MovieList movies={movies} title="Benzer Filmler" />;
}

export default SimilarMovies;
