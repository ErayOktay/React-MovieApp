import { NavLink } from "react-router";
import { CATEGORIES } from "../utils/categories";

// Kategori sayfaları arasında hızlı geçiş (yatay kaydırılabilir hap menü).
export default function CategoryTabs() {
  return (
    <nav aria-label="Film kategorileri" className="pill-nav mb-4">
      {CATEGORIES.map((c) => (
        <NavLink key={c.key} to={c.to} end className="pill-link">
          {c.short}
        </NavLink>
      ))}
      <NavLink to="/genres" className="pill-link">
        Türler
      </NavLink>
      <NavLink to="/search" className="pill-link">
        <i className="bi bi-sliders me-1" aria-hidden="true"></i>Gelişmiş Arama
      </NavLink>
    </nav>
  );
}
