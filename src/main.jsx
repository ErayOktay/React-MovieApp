import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainApp from "./MainApp";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/css/brands.css";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import UserContextProvider from "./contexts/UserContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <UserContextProvider>
        <MainApp />
      </UserContextProvider>
    </ThemeProvider>
  </StrictMode>
);
