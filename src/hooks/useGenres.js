import { useEffect, useState } from "react";
import { getGenres } from "../services/tmdb";

// Tür listesi uygulama genelinde bir kez çekilir; hata olursa boş liste döner
// ve arayüz türsüz de çalışmaya devam eder.
export default function useGenres() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    let active = true;
    getGenres()
      .then((list) => active && setGenres(list))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return genres;
}
