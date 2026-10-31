// Film keşif kategorileri. Navbar, kategori sayfaları ve anasayfa buradan beslenir.
export const CATEGORIES = [
  {
    key: "popular",
    label: "Popüler Filmler",
    short: "Popüler",
    to: "/movies",
    path: "/movie/popular",
  },
  {
    key: "top-rated",
    label: "En Çok Oy Alan Filmler",
    short: "En Çok Oy Alan",
    to: "/movies/top-rated",
    path: "/movie/top_rated",
  },
  {
    key: "upcoming",
    label: "Yakında Gelecek Filmler",
    short: "Yakında",
    to: "/movies/upcoming",
    path: "/movie/upcoming",
  },
  {
    key: "now-playing",
    label: "Vizyondaki Filmler",
    short: "Vizyondakiler",
    to: "/movies/now-playing",
    path: "/movie/now_playing",
  },
];

export const getCategory = (key) => CATEGORIES.find((c) => c.key === key);
