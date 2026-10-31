import { Link } from "react-router";

function Logo() {
  return (
    <Link to="/" className="navbar-brand fw-bold">
      <i className="bi bi-film me-2" aria-hidden="true"></i>
      Movie App
    </Link>
  );
}

export default Logo;
