import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from "./components/Main";

import MovieList from "./components/MovieList";
import WatchList from "./components/WatchList";
import Logo from "./components/Logo";
import SearchAndWatchListBtn from "./components/SearchAndWatchListBtn";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import MovieDetails from "./components/MovieDetails";

const api_key = import.meta.env.VITE_TMDB_API_KEY;
const page = 1;
const language = "tr-TR";

function App() {
  const [movies, setMovies] = useState([]); // useState sayfaya f5 atmadan f5 atmayı sağlar. örn: Butona basınca sayının güncellenmesi
  const [watchListMovies, setWatchListMovies] = useState([]);
  const [openWatchList, setWatchList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searhQuery, setQuery] = useState([""]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    async function getMovies() {
      const loading = true;
      setLoading(loading);

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searhQuery}&language=${language}&page=${page}&append_to_response=credits`
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

    if (searhQuery.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    getMovies();
  }, [searhQuery]);

  function addWatchList(movie) {
    const isAddedToList = watchListMovies.map((i) => i.id).includes(movie.id); // aynı filmi tekrar eklememek için kontrol

    if (!isAddedToList) {
      setWatchListMovies((movies) => [...movies, movie]); // filmi listeye ekler
    }
  }

  function removeWatchList(movie) {
    setWatchListMovies((movies) => movies.filter((m) => m.id !== movie.id));
  }

  function scrollToUp(movie) {
    setSelectedMovie(movie);
    window.scrollTo(0, 0);
  }

  return (
    <>
      <Header>
        <Logo />
        <SearchAndWatchListBtn
          movies={watchListMovies}
          setWatchList={setWatchList}
          setQuery={setQuery}
          searhQuery={searhQuery}
        />
      </Header>
      <Main>
        {selectedMovie && (
          <MovieDetails
            movieObj={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}

        <WatchList
          movies={watchListMovies}
          openWatchList={openWatchList}
          removeWatchList={removeWatchList}
        />

        {loading && <Loading />}

        {!loading && !error && (
          <MovieList
            movies={movies}
            addWatchList={addWatchList}
            setSelectedMovie={scrollToUp}
          />
        )}

        {error && <ErrorMessage message={error} />}
      </Main>
      <Footer />
    </>
  );
}

export default App; // diğer dosyalarda kullanılabilir olmayı sağlar.
