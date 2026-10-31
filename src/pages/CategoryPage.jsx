import { useCallback } from "react";
import CategoryTabs from "../components/CategoryTabs";
import InfiniteMovieGrid from "../components/InfiniteMovieGrid";
import { getMovieCategory } from "../services/tmdb";
import { getCategory } from "../utils/categories";

// Popüler / En çok oy alan / Yakında / Vizyondaki sayfalarının ortak bileşeni.
// Hepsi aynı sonsuz kaydırma altyapısını kullanır.
export default function CategoryPage({ category }) {
  const config = getCategory(category);

  const fetchPage = useCallback(
    (page, signal) => getMovieCategory(config.path, page, signal),
    [config.path]
  );

  return (
    <div className="container-xl py-4">
      <h1 className="h3 fw-semibold mb-3 px-1">{config.label}</h1>
      <CategoryTabs />
      <InfiniteMovieGrid
        key={category}
        fetchPage={fetchPage}
        emptyState={
          <p className="text-center text-body-secondary py-5">Film bulunamadı</p>
        }
      />
    </div>
  );
}
