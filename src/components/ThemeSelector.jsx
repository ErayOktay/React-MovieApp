import React, { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";

function ThemeSelector() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="theme-selector mx-4 mt-1 fs-5 pointer">
      <i
        className={`bi ${
          theme === "dark" ? "bi-sun-fill" : "bi-moon-stars-fill"
        } text-white fs-5 pointer`}
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      ></i>
    </div>
  );
}

export default ThemeSelector;
