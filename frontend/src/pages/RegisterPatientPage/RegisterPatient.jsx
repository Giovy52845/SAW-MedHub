import { Link } from "react-router-dom";

import GoogleLogin from "../../components/GoogleLogin/GoogleLogin";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

import logo_green from "../../assets/img/navbar_logo_green.png";

import "./RegisterPatient.css";

export default function RegisterPatient() {
  return (
    <div>
      <div className="container register-logo">
        <Link to={"/"}>
          <img src={logo_green} alt="Logo MedHUB" className="img-fluid" />
        </Link>
      </div>
      <div className="container">
        <hr />
      </div>

      <div className="container register-input-container col-12 col-lg-3">
        <h3>Crea un account</h3>
        <GoogleLogin />
        <div className="register-divider row">
          <div className="col-5">
            <hr />
          </div>
          <div className="col-2 register-line-text">
            <span>o</span>
          </div>
          <div className="col-5">
            <hr />
          </div>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
