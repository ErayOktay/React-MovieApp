import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import ThemeSelector from "./ThemeSelector";
import useGenres from "../hooks/useGenres";
import { UserContext } from "../contexts/UserContext";
import { CATEGORIES } from "../utils/categories";

function Navbar() {
  const { watchList } = useContext(UserContext);
  const genres = useGenres();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false); // mobil hamburger menü
  const [moviesOpen, setMoviesOpen] = useState(false); // Filmler açılır menüsü
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);

  const moviesActive = /^\/(movies|genres?)(\/|$)/.test(location.pathname);

  // Her sayfa geçişinde (arama dahil) menüleri kapat.
  useEffect(() => {
    setMenuOpen(false);
    setMoviesOpen(false);
  }, [location.key]);

  // Açılır menü: dışarı tıklayınca veya Escape ile kapanır.
  useEffect(() => {
    if (!moviesOpen) return;
    const onPointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMoviesOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMoviesOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [moviesOpen]);

  return (
    <nav
      className="navbar navbar-expand-lg bg-dark border-bottom border-body sticky-top app-navbar"
      data-bs-theme="dark"
      aria-label="Ana menü"
    >
      <div className="container-xl">
        <Logo />

        <div className="d-flex align-items-center gap-2 order-lg-3">
          <ThemeSelector />
          <Link
            to="/watchlist"
            className="btn btn-outline-light btn-sm position-relative"
            aria-label={`İzlenecek filmler (${watchList.length})`}
          >
            <i className="bi bi-heart-fill"></i>
            <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger translate-middle">
              {watchList.length}
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-controls="main-menu"
            aria-expanded={menuOpen}
            aria-label="Menüyü aç/kapat"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div
          id="main-menu"
          className={`collapse navbar-collapse order-lg-2 ${menuOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav me-lg-2">
            <li className="nav-item">
              <NavLink to="/" end className="nav-link">
                Ana Sayfa
              </NavLink>
            </li>

            <li className="nav-item mega-dropdown" ref={dropdownRef}>
              <button
                ref={toggleRef}
                type="button"
                className={`nav-link dropdown-toggle w-100 text-start bg-transparent border-0 ${
                  moviesActive || moviesOpen ? "active" : ""
                }`}
                aria-expanded={moviesOpen}
                aria-controls="movies-menu"
                onClick={() => setMoviesOpen((open) => !open)}
              >
                Filmler
              </button>

              <div
                id="movies-menu"
                className={`mega-menu ${moviesOpen ? "show" : ""}`}
              >
                <div className="row g-3">
                  <div className="col-12 col-lg-4">
                    <p className="mega-title">Keşfet</p>
                    <ul className="list-unstyled mb-0">
                      {CATEGORIES.map((c) => (
                        <li key={c.key}>
                          <Link to={c.to} className="mega-link">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link to="/search" className="mega-link">
                          <i className="bi bi-sliders me-1" aria-hidden="true"></i>
                          Gelişmiş Arama
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 col-lg-8">
                    <p className="mega-title">
                      Türler{" "}
                      <Link to="/genres" className="mega-all">
                        Tümü
                      </Link>
                    </p>
                    {genres.length > 0 ? (
                      <ul className="list-unstyled mb-0 mega-genres">
                        {genres.map((g) => (
                          <li key={g.id}>
                            <Link to={`/genre/${g.id}`} className="mega-link">
                              {g.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Link to="/genres" className="mega-link">
                        Tüm türleri gör
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <SearchForm className="flex-grow-1 my-2 my-lg-0 mx-lg-2" />

          <ul className="navbar-nav ms-lg-2">
            <li className="nav-item">
              <NavLink to="/login" className="nav-link">
                Giriş Yap
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/register" className="nav-link">
                Kayıt Ol
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
