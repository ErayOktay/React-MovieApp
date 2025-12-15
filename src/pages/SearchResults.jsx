import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import MovieList from "../components/MovieList";
import { useSearchParams } from "react-router";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

const apiUrl = "https://api.themoviedb.org/3";
const api_key = "38b433bd7b3d5056ece6f0bb98fa260d";
const language = "tr-TR";

function SearchResults() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);

  const query = searchParams.get("q");
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    async function getMovies() {
      const loading = true;
      setLoading(loading);

      try {
        const response = await fetch(
          `${apiUrl}/search/movie?api_key=${api_key}&query=${query}&language=${language}&page=${page}&append_to_response=credits`
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

        if (data.results) {
          setMovies(data.results);
          setTotalPages(data.total_pages);
        }
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
  }, [searchParams]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <div className="container my-2">
        <MovieList
          movies={movies}
          title={`Arama Sonuçları: ${query}`}
          showHeaderPagination={true}
          page={page}
          query={query}
          setSearchParams={setSearchParams}
          totalPages={totalPages}
        />
      </div>
      <Pagination
        page={page}
        query={query}
        setSearchParams={setSearchParams}
        totalPages={totalPages}
      />
      <Footer />
    </>
  );
}

export default SearchResults;
