import { Link } from "react-router-dom";

import GoogleLogin from "../../components/GoogleLogin/GoogleLogin";
import LoginForm from "../../components/LoginForm/LoginForm.jsx";

import logo_green from "../../assets/img/navbar_logo_green.png";

import "./LoginPage.css";

export default function LoginPage() {
  return (
    <div>
      <div className="container login-logo">
        <Link to={"/"}>
          <img src={logo_green} alt="Logo MedHUB" className="img-fluid" />
        </Link>
      </div>
      <div className="container">
        <hr />
      </div>
      <div className="container login-input-container col-12 col-lg-3">
        <h3>Effettua il login al tuo account</h3>
        <GoogleLogin />
        <div className="login-divider row">
          <div className="col-5">
            <hr />
          </div>
          <div className="col-2 login-line-text">
            <span>o</span>
          </div>
          <div className="col-5">
            <hr />
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
