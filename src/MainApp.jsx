import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayouts from "./layouts/MainLayouts";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import { useContext } from "react";
import ThemeContext from "./contexts/ThemeContext";
import UserWatchList from "./pages/UserWatchList";
import Login from "./pages/LoginState";
import Register from "./pages/Register";
import CategoryPage from "./pages/CategoryPage";
import GenrePage from "./pages/GenrePage";
import GenresPage from "./pages/GenresPage";
import PersonDetails from "./pages/PersonDetails";
import NotFound from "./pages/NotFound";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "movies",
        element: <Movies />,
      },
      {
        path: "movies/top-rated",
        element: <CategoryPage category="top-rated" />,
      },
      {
        path: "movies/upcoming",
        element: <CategoryPage category="upcoming" />,
      },
      {
        path: "movies/now-playing",
        element: <CategoryPage category="now-playing" />,
      },
      {
        path: "movies/:id",
        element: <MovieDetails />,
      },
      {
        path: "genres",
        element: <GenresPage />,
      },
      {
        path: "genre/:genreId",
        element: <GenrePage />,
      },
      {
        path: "person/:id",
        element: <PersonDetails />,
      },
      {
        path: "search", // search?q=father
        element: <SearchResults />,
      },
      {
        path: "watchlist",
        element: <UserWatchList />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function MainApp() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`bg-${theme}`} data-bs-theme={theme}>
      <RouterProvider router={routes} />
    </div>
  );
}

export default MainApp;
