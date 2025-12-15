import React, { useContext, useRef, useState } from "react";
import ThemeContext from "../contexts/ThemeContext";
import Footer from "../components/Footer";

function Login() {
  const { theme } = useContext(ThemeContext);
  const btnColor = theme === "dark" ? "light" : "dark";

  const email = useRef();
  const password = useRef();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function handleFormSubmit(e) {
    e.preventDefault(); // sayfanın resetlenmesini önler

    setEmailError(false);
    setPasswordError(false);

    const emailValue = email.current.value;
    const passwordValue = password.current.value;

    const emailIsInvalid = !emailValue.includes("@");
    const passwordIsInvalid = passwordValue.length < 5;

    if (emailIsInvalid) {
      setEmailError(true);
      return;
    }

    if (passwordIsInvalid) {
      setPasswordError(true);
      return;
    }

    console.log(emailValue, passwordValue);

    email.current.value = "";
    password.current.value = "";
  }

  return (
    <>
      <div
        className={` container my-5 py-5 bg-${theme} ${
          theme === "dark" ? "text-white" : "text-dark"
        } `}
        data-bs-theme={theme}
      >
        <div className="row">
          <div className="col-7 my-4 py-2 mx-auto">
            <div className="card">
              <div className="card-header">
                <h1 className="h4 mb-0">Giriş Yap</h1>
              </div>
              <div className="card-body">
                <form onSubmit={handleFormSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      E-posta
                    </label>
                    <input
                      type="email"
                      ref={email}
                      name="email"
                      id="email"
                      className="form-control"
                    />
                    {emailError && (
                      <div className="invalid-feedback d-block">
                        Geçerli e-posta giriniz
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Parola
                    </label>
                    <input
                      type="password"
                      ref={password}
                      name="password"
                      id="password"
                      className="form-control"
                    />
                    {passwordError && (
                      <div className="invalid-feedback d-block">
                        Min. 5 karakter giriniz
                      </div>
                    )}
                  </div>
                  <button className={`btn btn-outline-${btnColor}`}>
                    Giriş Yap
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
