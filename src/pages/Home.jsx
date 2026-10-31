import React from "react";
import { Link } from "react-router";
import SearchForm from "../components/SearchForm";
import { CATEGORIES } from "../utils/categories";

function Home() {
  return (
    <div id="home" className="min-vh-100 d-flex align-items-center">
      <div className="img-overlay w-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-7 text-center text-white">
              <h1 className="fw-bold mb-3 display-2">Hoş Geldiniz!</h1>

              <p className="fs-5 text-white-50 mb-4">
                Milyonlarca film, dizi ve oyuncu tek bir yerde.
              </p>

              <div className=" bg-opacity-75 p-4 rounded-3 shadow">
                <SearchForm />
              </div>

              <nav
                aria-label="Film kategorileri"
                className="d-flex flex-wrap justify-content-center gap-2 mt-4"
              >
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.key}
                    to={c.to}
                    className="btn btn-outline-light btn-sm rounded-pill px-3"
                  >
                    {c.short}
                  </Link>
                ))}
                <Link
                  to="/genres"
                  className="btn btn-outline-light btn-sm rounded-pill px-3"
                >
                  Türler
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
