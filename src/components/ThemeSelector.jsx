import React, { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";

function ThemeSelector() {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="btn btn-outline-light btn-sm theme-selector"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
      title={isDark ? "Açık tema" : "Koyu tema"}
    >
      <i className={`bi ${isDark ? "bi-sun-fill" : "bi-moon-stars-fill"}`}></i>
    </button>
  );
}

export default ThemeSelector;
