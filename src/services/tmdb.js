// Tüm TMDB istekleri bu dosyadan geçer. API anahtarı koda gömülmez;
// proje kökündeki .env dosyasından (VITE_TMDB_API_KEY) okunur.
const API_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const DEFAULT_LANGUAGE = "tr-TR";
const IMG_BASE_URL = "https://image.tmdb.org/t/p";

export function imageUrl(path, size = "w342") {
  return path ? `${IMG_BASE_URL}/${size}${path}` : null;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function messageForStatus(status) {
  if (status === 401)
    return "Uygulamada bir yetkilendirme sorunu var. Kısa süre içinde düzeltilecektir.";
  if (status === 404) return "İstenen kayıt bulunamadı.";
  if (status === 429)
    return "Sunucu şu anda yoğun. Birkaç saniye sonra tekrar deneyin.";
  if (status >= 500)
    return "Sunucuda geçici bir sorun var. Lütfen biraz sonra tekrar deneyin.";
  return "Bağlantı kurulurken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.";
}

async function request(path, params = {}, signal) {
  if (!API_KEY) {
    throw new ApiError(
      "TMDB API anahtarı tanımlı değil. Proje köküne .env dosyası ekleyip VITE_TMDB_API_KEY değerini girin.",
      0
    );
  }

  const url = new URL(`${API_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", DEFAULT_LANGUAGE);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError(
      navigator.onLine
        ? "Sunucuya bağlantı kurulamadı."
        : "İnternet bağlantınız yok. Lütfen Wi-Fi veya mobil verinizi kontrol edin.",
      0
    );
  }

  if (!response.ok) {
    throw new ApiError(messageForStatus(response.status), response.status);
  }
  return response.json();
}

// ---- Film listeleri ----------------------------------------------------
export const getMovieCategory = (path, page, signal) =>
  request(path, { page }, signal);

export const discoverMovies = (params, page, signal) =>
  request(
    "/discover/movie",
    { include_adult: false, include_video: false, ...params, page },
    signal
  );

export const searchMovies = (query, page, signal) =>
  request("/search/movie", { query, page, include_adult: false }, signal);

export const getSimilarMovies = (id, signal) =>
  request(`/movie/${id}/similar`, { page: 1 }, signal);

// ---- Film detayı -------------------------------------------------------
export const getMovieDetails = (id, signal) => request(`/movie/${id}`, {}, signal);
export const getMovieCredits = (id, signal) =>
  request(`/movie/${id}/credits`, {}, signal);

// ---- Oyuncu ------------------------------------------------------------
export const getPerson = (id, params, signal) =>
  request(`/person/${id}`, params, signal);
export const getPersonMovieCredits = (id, signal) =>
  request(`/person/${id}/movie_credits`, {}, signal);

// ---- Türler (uygulama boyunca bir kez çekilir) ---------------------------
let genresPromise = null;
export function getGenres() {
  if (!genresPromise) {
    genresPromise = request("/genre/movie/list")
      .then((data) => data.genres || [])
      .catch((err) => {
        genresPromise = null; // hata durumunda sonraki denemeye izin ver
        throw err;
      });
  }
  return genresPromise;
}
