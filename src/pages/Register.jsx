import React, { useContext, useRef } from "react";
import ThemeContext from "../contexts/ThemeContext";

function Register() {
  const { theme } = useContext(ThemeContext);
  const btnColor = theme === "dark" ? "light" : "dark";

  function handleFormSubmit(e) {
    e.preventDefault(); // sayfanın resetlenmesini önler

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  }

  return (
    <>
      <div
        className={`container py-5 bg-${theme} ${
          theme === "dark" ? "text-white" : "text-dark"
        }`}
        data-bs-theme={theme}
      >
        <div className="row">
          <div className="col-12 ">
            <div className="card">
              <div className="card-header">
                <h1 className="h4 mb-0">Kayıt Ol</h1>
              </div>

              <div className="card-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      İsim
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Parola
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="repassword" className="form-label">
                          Parola Tekrar
                        </label>
                        <input
                          type="password"
                          name="repassword"
                          id="repassword"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">İlgimi Çeken Türler</label>

                    <div className="card card-body">
                      <div className="row g-2">
                        <div className="col-6 col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="drama"
                            />
                            <label className="form-check-label" htmlFor="drama">
                              Dram
                            </label>
                          </div>
                        </div>

                        <div className="col-6 col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="comedy"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="comedy"
                            >
                              Komedi
                            </label>
                          </div>
                        </div>

                        <div className="col-6 col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="action"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="action"
                            >
                              Aksiyon
                            </label>
                          </div>
                        </div>

                        <div className="col-6 col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="horror"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="horror"
                            >
                              Korku
                            </label>
                          </div>
                        </div>

                        <div className="col-6 col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="scifi"
                            />
                            <label className="form-check-label" htmlFor="scifi">
                              Bilim Kurgu
                            </label>
                          </div>
                        </div>

                        <div className="col-6 col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="romance"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="romance"
                            >
                              Romantik
                            </label>
                          </div>
                        </div>

                        <div className="col-6 col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="fantasy"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="fantasy"
                            >
                              Fantastik
                            </label>
                          </div>
                        </div>
                        <div className="col-6 col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="thriller"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="thriller"
                            >
                              Gerilim
                            </label>
                          </div>
                        </div>
                        <div className="col-6 col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="sports"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="sports"
                            >
                              Spor
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className={`btn btn-outline-${btnColor}`}>
                    Kayıt Ol
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Register;
