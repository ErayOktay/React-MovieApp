import { useEffect, useMemo, useRef } from "react";
import useInfiniteList from "../hooks/useInfiniteList";
import MovieGrid from "./MovieGrid";
import MovieSkeletonGrid from "./MovieSkeletonGrid";
import ErrorMessage from "./ErrorMessage";

/**
 * Sonsuz kaydırmalı film ızgarası.
 * Liste sıfırlanmak istendiğinde (arama/filtre değişince) üst bileşen bu
 * bileşene yeni bir `key` vermelidir; böylece sayfa ve istek durumu temizlenir.
 */
export default function InfiniteMovieGrid({ fetchPage, transform, emptyState }) {
  const { items, page, loading, error, hasMore, stalled, loadMore, loadMoreManually } =
    useInfiniteList(fetchPage);
  const sentinelRef = useRef(null);

  const movies = useMemo(
    () => (transform ? transform(items) : items),
    [items, transform]
  );

  // Liste sonundaki görünmez eleman ekrana yaklaşınca sıradaki sayfa istenir.
  // Yükleme bittiğinde gözlemci yeniden kurulur; eleman hâlâ görünüyorsa
  // (kısa liste, geniş ekran) bir sonraki sayfa da otomatik gelir.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading || error || stalled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, error, stalled, page, loadMore]);

  if (page === 0 && !error) return <MovieSkeletonGrid />;
  if (error && items.length === 0) {
    return <ErrorMessage message={error} onRetry={loadMoreManually} />;
  }

  return (
    <>
      {movies.length > 0 ? (
        <MovieGrid movies={movies} />
      ) : (
        !hasMore && emptyState
      )}

      {hasMore && !stalled && !error && (
        <div ref={sentinelRef} className="infinite-sentinel" aria-hidden="true" />
      )}

      {loading && (
        <div className="d-flex justify-content-center py-4" role="status">
          <div className="spinner-border text-primary" aria-hidden="true"></div>
          <span className="visually-hidden">Daha fazla film yükleniyor...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-2 mt-4" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn-sm btn-danger" onClick={loadMoreManually}>
            <i className="bi bi-arrow-repeat me-1"></i>Tekrar Dene
          </button>
        </div>
      )}

      {stalled && hasMore && (
        <div className="text-center py-4">
          <p className="text-body-secondary small mb-2">
            Yüklenen sayfalarda filtrelere uyan yeni film çıkmadı.
          </p>
          <button type="button" className="btn btn-outline-primary" onClick={loadMoreManually}>
            Daha fazla sonuç ara
          </button>
        </div>
      )}

      {!hasMore && movies.length > 0 && (
        <p className="text-center text-body-secondary small py-4 mb-0">
          Tüm sonuçlar gösterildi.
        </p>
      )}
    </>
  );
}
