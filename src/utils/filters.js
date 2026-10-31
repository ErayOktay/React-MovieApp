// Arama / keşif filtrelerinin URL <-> state dönüşümleri ve API parametreleri.

export const EMPTY_FILTERS = {
  q: "",
  genres: [],
  minRating: "",
  maxRating: "",
  yearFrom: "",
  yearTo: "",
  dateFrom: "",
  dateTo: "",
  lang: "",
  sort: "",
};

export const SORT_OPTIONS = [
  { value: "", label: "Varsayılan" },
  { value: "popularity", label: "Popülerlik", api: "popularity.desc" },
  { value: "rating", label: "Puan (yüksekten düşüğe)", api: "vote_average.desc" },
  { value: "newest", label: "Yayın tarihi (yeni → eski)", api: "primary_release_date.desc" },
  { value: "oldest", label: "Yayın tarihi (eski → yeni)", api: "primary_release_date.asc" },
  { value: "title_asc", label: "Başlık (A → Z)", api: "title.asc" },
  { value: "title_desc", label: "Başlık (Z → A)", api: "title.desc" },
];

export const LANGUAGES = [
  ["en", "İngilizce"],
  ["tr", "Türkçe"],
  ["fr", "Fransızca"],
  ["de", "Almanca"],
  ["es", "İspanyolca"],
  ["it", "İtalyanca"],
  ["pt", "Portekizce"],
  ["ru", "Rusça"],
  ["ja", "Japonca"],
  ["ko", "Korece"],
  ["zh", "Çince"],
  ["hi", "Hintçe"],
  ["ar", "Arapça"],
];

const PARAM_KEYS = {
  q: "q",
  genres: "genre",
  minRating: "min_rating",
  maxRating: "max_rating",
  yearFrom: "year_from",
  yearTo: "year_to",
  dateFrom: "date_from",
  dateTo: "date_to",
  lang: "lang",
  sort: "sort",
};

export function parseFilters(searchParams) {
  const get = (key) => searchParams.get(PARAM_KEYS[key]) ?? "";
  return {
    q: get("q"),
    genres: get("genres")
      .split(",")
      .filter((id) => /^\d+$/.test(id)),
    minRating: get("minRating"),
    maxRating: get("maxRating"),
    yearFrom: get("yearFrom"),
    yearTo: get("yearTo"),
    dateFrom: get("dateFrom"),
    dateTo: get("dateTo"),
    lang: get("lang"),
    sort: SORT_OPTIONS.some((o) => o.value === get("sort")) ? get("sort") : "",
  };
}

// Boş olmayan filtreleri sabit sırayla URL sorgu metnine çevirir.
export function serializeFilters(filters) {
  const params = new URLSearchParams();
  Object.entries(PARAM_KEYS).forEach(([key, paramName]) => {
    const value = key === "genres" ? filters.genres.join(",") : filters[key];
    if (value) params.set(paramName, value);
  });
  return params.toString();
}

// ---- Doğrulama (yazarken değil, kullanırken yapılır) ---------------------
const toRating = (v) => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 && n <= 10 ? n : null;
};
const isYear = (v) => /^\d{4}$/.test(v) && Number(v) >= 1874 && Number(v) <= 2100;

const minRating = (f) => {
  const n = toRating(f.minRating);
  return n !== null && n > 0 ? n : null;
};
const maxRating = (f) => {
  const n = toRating(f.maxRating);
  return n !== null && n < 10 ? n : null;
};
const releaseFrom = (f) => f.dateFrom || (isYear(f.yearFrom) ? `${f.yearFrom}-01-01` : "");
const releaseTo = (f) => f.dateTo || (isYear(f.yearTo) ? `${f.yearTo}-12-31` : "");

export function countActiveFilters(f) {
  return (
    f.genres.length +
    (minRating(f) !== null ? 1 : 0) +
    (maxRating(f) !== null ? 1 : 0) +
    (releaseFrom(f) ? 1 : 0) +
    (releaseTo(f) ? 1 : 0) +
    (f.lang ? 1 : 0) +
    (f.sort ? 1 : 0)
  );
}

// ---- /discover/movie parametreleri (sunucu tarafı filtreleme) -------------
export function toDiscoverParams(f) {
  const params = {};
  const min = minRating(f);
  const max = maxRating(f);
  const from = releaseFrom(f);
  const to = releaseTo(f);
  const sort = SORT_OPTIONS.find((o) => o.value === f.sort);

  if (f.genres.length) params.with_genres = f.genres.join(","); // virgül = hepsi
  if (min !== null) params["vote_average.gte"] = min;
  if (max !== null) params["vote_average.lte"] = max;
  if (from) params["primary_release_date.gte"] = from;
  if (to) params["primary_release_date.lte"] = to;
  if (f.lang) params.with_original_language = f.lang;
  params.sort_by = sort?.api || "popularity.desc";

  // Birkaç oyla "10 puan" alan filmler sonuçları bozmasın.
  if (f.sort === "rating") params["vote_count.gte"] = 200;
  else if (min !== null || max !== null) params["vote_count.gte"] = 20;

  // "En yeni" sıralaması henüz çıkmamış filmlerle başlamasın.
  if (f.sort === "newest" && !to) {
    params["primary_release_date.lte"] = new Date().toISOString().slice(0, 10);
  }
  return params;
}

// ---- /search/movie yalnızca sorgu destekler; filtreler istemcide uygulanır ----
export function applyClientFilters(movies, f) {
  const min = minRating(f);
  const max = maxRating(f);
  const from = releaseFrom(f);
  const to = releaseTo(f);

  return movies.filter((m) => {
    if (f.genres.length && !f.genres.every((g) => m.genre_ids?.includes(Number(g))))
      return false;
    const rating = m.vote_average ?? 0;
    if (min !== null && rating < min) return false;
    if (max !== null && rating > max) return false;
    if (f.lang && m.original_language !== f.lang) return false;
    const date = m.release_date || "";
    if (from && (!date || date < from)) return false;
    if (to && (!date || date > to)) return false;
    return true;
  });
}

export function sortMovies(movies, sort) {
  if (!sort) return movies;
  const byDate = (dir) => (a, b) => {
    const da = a.release_date || "";
    const db = b.release_date || "";
    if (!da && !db) return 0;
    if (!da) return 1; // tarihsizler hep sonda
    if (!db) return -1;
    return dir * da.localeCompare(db);
  };
  const comparators = {
    popularity: (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
    rating: (a, b) => {
      const ra = (a.vote_count ?? 0) >= 10 ? 1 : 0; // az oy alanlar sonda
      const rb = (b.vote_count ?? 0) >= 10 ? 1 : 0;
      return rb - ra || (b.vote_average ?? 0) - (a.vote_average ?? 0);
    },
    newest: byDate(-1),
    oldest: byDate(1),
    title_asc: (a, b) => (a.title || "").localeCompare(b.title || "", "tr"),
    title_desc: (a, b) => (b.title || "").localeCompare(a.title || "", "tr"),
  };
  return [...movies].sort(comparators[sort]);
}
