import React from "react";
import SearchForm from "../components/SearchForm";

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
