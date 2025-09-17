import { useNavigate, Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

import logo from "../../assets/img/navbar_logo_green.png";

import "./RemindPassword.css";
import { useState } from "react";

export default function RemindPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [reset, setReset] = useState(false);
  const [error, setError] = useState(false);

  const auth = getAuth();

  function handleResetPsw() {
    if (email === "") {
      toast.error("Inserisci l'email prima di inviare l'email di reset.");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setReset(true);
      })
      .catch((err) => {
        setError(true);
      });
  }

  return (
    <div className="remind-password-container container">
      <div className="remind-password-header">
        <img src={logo} alt="Logo MedHUB" onClick={() => navigate("/")} />
      </div>
      {!reset ? (
        <div className="remind-password-body">
          <h3>Per prima cosa, inserisci la tua email</h3>
          <p>
            Riceverai un messaggio con un link da cui potrai impostare una nuova
          </p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Inserisci l'email..."
          />
          <button onClick={() => handleResetPsw()}>Invia</button>
          {error && (
            <p className="error-message">
              Si è verificato un errore nel reset della password.
            </p>
          )}
        </div>
      ) : (
        <p>
          Email di reset inviata con successo. Esegui il{" "}
          <Link to="/login-page">Login</Link>.
        </p>
      )}
    </div>
  );
}
