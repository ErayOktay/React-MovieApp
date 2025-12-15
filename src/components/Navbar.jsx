import { NavLink } from "react-router";
import { Link } from "react-router";
import Logo from "../components/Logo";
import SearchForm from "./SearchForm";
import ThemeSelector from "./ThemeSelector";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";

function Navbar() {
  const { watchList } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav
      className="navbar navbar-expand-lg bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container">
        <Logo />
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          data-bs-toggle="collapse"
          aria-expanded={isOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/movies" className="nav-link">
                Movies
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/register" className="nav-link">
                Register
              </NavLink>
            </li>
          </ul>
        </div>
        <ThemeSelector />
        <SearchForm />
        <Link
          to="/watchlist"
          className={`btn btn-dark border position-relative ms-2`}
        >
          <i className="bi bi-heart-fill"></i>
          <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger translate-middle">
            {watchList.length}
          </span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
