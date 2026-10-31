import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="container-xl py-5 text-center">
      <p className="display-1 fw-bold mb-0">404</p>
      <p className="lead mb-4">Aradığınız sayfa bulunamadı.</p>
      <Link to="/" className="btn btn-primary">
        Ana sayfaya dön
      </Link>
    </div>
  );
}
