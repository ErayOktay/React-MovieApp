import { useCallback, useEffect, useRef, useState } from "react";

const MAX_PAGES = 500; // TMDB 500. sayfadan sonrasını kabul etmez
const EMPTY_PAGE_LIMIT = 5; // art arda boş (filtrelenmiş) sayfa sınırı

/**
 * Sonsuz kaydırma için sayfa yükleyici.
 * - fetchPage(page, signal) => { results, total_pages } döndürmelidir.
 * - Liste sıfırlanacaksa bileşen `key` ile yeniden bağlanmalıdır.
 */
export default function useInfiniteList(fetchPage) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0); // son başarıyla yüklenen sayfa
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [stalled, setStalled] = useState(false);

  const fetchRef = useRef(fetchPage);
  const nextPageRef = useRef(1);
  const busyRef = useRef(false);
  const hasMoreRef = useRef(true);
  const emptyStreakRef = useRef(0);
  const seenRef = useRef(new Set());
  const controllerRef = useRef(null);

  useEffect(() => {
    fetchRef.current = fetchPage;
  }, [fetchPage]);

  const load = useCallback(async () => {
    if (busyRef.current || !hasMoreRef.current) return; // çift istek koruması
    busyRef.current = true;
    setLoading(true);
    setError("");

    const controller = new AbortController();
    controllerRef.current = controller;
    const pageNo = nextPageRef.current;

    try {
      const data = await fetchRef.current(pageNo, controller.signal);
      if (controller.signal.aborted) return;

      // Sayfalar çakışırsa aynı film iki kez eklenmesin.
      const fresh = [];
      for (const movie of data.results || []) {
        if (!seenRef.current.has(movie.id)) {
          seenRef.current.add(movie.id);
          fresh.push(movie);
        }
      }

      emptyStreakRef.current = fresh.length ? 0 : emptyStreakRef.current + 1;
      const more = pageNo < Math.min(data.total_pages || 0, MAX_PAGES);
      hasMoreRef.current = more;
      nextPageRef.current = pageNo + 1;

      if (fresh.length) setItems((prev) => [...prev, ...fresh]);
      setHasMore(more);
      setStalled(more && emptyStreakRef.current >= EMPTY_PAGE_LIMIT);
      setPage(pageNo);
    } catch (err) {
      if (controller.signal.aborted || err.name === "AbortError") return;
      setError(err.message || "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      if (controllerRef.current === controller) {
        busyRef.current = false;
        setLoading(false);
      }
    }
  }, []);

  // İlk sayfa; bileşen kaldırılınca uçuştaki istek iptal edilir.
  useEffect(() => {
    load();
    return () => {
      controllerRef.current?.abort();
      busyRef.current = false;
    };
  }, [load]);

  // Kullanıcı "daha fazla ara" dediğinde otomatik yükleme sayacı sıfırlanır.
  const loadMoreManually = useCallback(() => {
    emptyStreakRef.current = 0;
    setStalled(false);
    load();
  }, [load]);

  return { items, page, loading, error, hasMore, stalled, loadMore: load, loadMoreManually };
}
