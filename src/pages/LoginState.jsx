import React, { useContext, useState } from "react";
import ThemeContext from "../contexts/ThemeContext";
import Footer from "../components/Footer";
import Input from "../components/Input";
import useInput from "../hooks/useInput";
import { hasMinLength, isEmail, isNotEmpty } from "../utils/validations";

function Login() {
  const { theme } = useContext(ThemeContext);
  const btnColor = theme === "dark" ? "light" : "dark";

  //   const [email, setEmail] = useState(""); çok fazla value olursa işe yaramaz
  //   const [password, setPassword] = useState("");

  const {
    value: emailValue,
    handleInputBlur: handleEmailBlur,
    handleInputChange: handleEmailChange,
    hasError: emailHasError,
  } = useInput("", (value) => isEmail(value) && isNotEmpty(value));
  const {
    value: passwordValue,
    handleInputBlur: handlePasswordBlur,
    handleInputChange: handlePasswordChange,
    hasError: passwordHasError,
  } = useInput("", (value) => hasMinLength(value, 8));

  function handleFormSubmit(e) {
    e.preventDefault(); // sayfanın resetlenmesini önler
    if (emailHasError || passwordHasError) {
      return;
    }
    console.log(emailValue, passwordValue);
  }

  return (
    <>
      <div
        className={` container my-5 py-5 bg-${theme} ${
          theme === "dark" ? "text-white" : "text-dark"
        } `}
        data-bs-theme={theme}
      >
        <div className="row py-2 ">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h1 className="h4 mb-0">Login</h1>
              </div>
              <div className="card-body">
                <form onSubmit={handleFormSubmit}>
                  <Input
                    id="email"
                    name="email"
                    labelText="Email"
                    error={emailHasError && "Geçerli e-posta giriniz"}
                    type="email"
                    value={emailValue}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                  />
                  <Input
                    id="password"
                    name="password"
                    labelText="Password"
                    error={passwordHasError && "Min. 8 karakter giriniz"}
                    type="password"
                    value={passwordValue}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                  />
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
