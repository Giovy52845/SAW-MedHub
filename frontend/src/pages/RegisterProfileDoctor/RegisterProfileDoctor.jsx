import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMinusCircle,
  faEye,
  faEyeSlash,
  faL,
} from "@fortawesome/free-solid-svg-icons";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../../firebase/firebase";

import MyNavbar from "../../components/Navbar/MyNavbar";
import doctor_img from "../../assets/img/Doctors-bro.png";

import "./RegisterProfileDoctor.css";

export default function RegisterProfileDoctor() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ordine, setOrdine] = useState("");
  const [ordinePlace, setOrdinePlace] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showMessagePsw, setShowMessagePsw] = useState(false);

  const passwordRequirements = [
    {
      label: "Minimo 8 caratteri",
      test: (val) => val.length >= 8,
    },
    {
      label: "Almeno un carattere maiuscolo",
      test: (val) => /[A-Z]/.test(val),
    },
    {
      label: "Almeno un carattere minuscolo",
      test: (val) => /[a-z]/.test(val),
    },
    {
      label: "Almeno un numero",
      test: (val) => /\d/.test(val),
    },
  ];

  useEffect(() => {
    if (!data?.step1Completed) {
      navigate("/register-doctor");
    }
  }, [data]);

  function isValid() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      city !== "" &&
      phone !== "" &&
      phone.length >= 8 && // <-- AGGIUNGI QUESTA &&
      emailRegex.test(email) &&
      password.length >= 8 &&
      ordine.length == 5 &&
      ordinePlace !== ""
    );
  }

  async function handleVerifyDoctor() {
    // Controllo che i dati dello STEP1 ci siano
    if (!data?.name || !data?.surname) {
      console.log("Dati non presenti o mancanti.");
      return;
    }

    // Preparo i dati da inviare
    const payload = {
      nome: data.name.trim().toLowerCase(),
      cognome: data.surname.trim().toLowerCase(),
      numero_ordine: ordine.trim(),
    };

    // ! VERIFICO SULL'ALBO FAKE CHE SIA EFFETTIVAMENTE UN SANITARIO
    try {
      const res = await fetch("http://localhost:3000/api/verifica-sanitario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.valido) {
        await registerUser();
      } else {
        // ? Le credenziali dell'utente non sono state trovate nell'albo
        alert(
          "Attenzione! I dati che hai inserito non corrispondono a nessuna persona registrata all'ordine. Sarai riderizionato alla homepage."
        );
        navigate("/");
      }
    } catch (err) {
      alert("Errore nella chiamata API. Sarai reinderizzato alla Homepage");
      navigate("/");
    }
  }

  // ? Funzione utilizzata per creare uno slug identificativo per le pagine /sanitario/nome-cognome-uid
  function generaSlug(nome, cognome, uid) {
    const nomeCognome = `${nome}-${cognome}`.toLowerCase().replace(/\s+/g, "-");
    const uidShort = uid.substring(0, 6);

    return `${nomeCognome}-${uidShort}`;
  }

  async function registerUser() {
    try {
      // ! Registro l'utente con Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const slug = generaSlug(data.name, data.surname, user.uid);
      // ! Se la registrazione è andata a buon fine creo il documento nel DB
      try {
        const res = await fetch("http://localhost:3000/api/sanitari", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            slug,
            nome: data.name.trim().toLowerCase(),
            cognome: data.surname.trim().toLowerCase(),
            email: user.email,
            telefono: phone.trim(),
            citta: city.trim().toLowerCase(),
            specializzazione: data.specializzazione,
            numero_ordine: ordine,
            ordine_citta: ordinePlace,
          }),
        });
        const result = await res.json();

        if (!result.success || !res.ok) {
          // Cancello l'utente
          await deleteUser;

          alert("Si è verificato un errore. Tornerai alla homepage.");
          navigate("/");
          return;
        }

        // ! Torna alla Homepage (Successo)
        navigate("/dashboard");
      } catch (err) {
        // ! SI E' VERIFICATO UN ERRORE NELLA CHIAMATA ALLA API registerSanitario

        // Essendo che la creazione dell'utente è stata effettuata, lo cancello
        await deleteUser(user);

        alert("Si è verificato un errore. Tornerai alla Homepage.");
        navigate("/");
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert(
          "L'email è già registrata. Effettua il login oppure usa un'altra email."
        );
      } else {
        alert(
          "Si è verificato un errore nella registrazione. Riprova più tardi."
        );
        navigate("/");
      }
    }
  }

  return (
    <>
      <MyNavbar variant={"minimal"} type={"light"} />
      <div className="container">
        <div className="row reg-profile-doctor__wrapper">
          <div className="col-12 col-lg-8 reg-profile-doctor-info">
            <h2>Registrati gratuitamente come Medico specialista</h2>
            <div className="reg-profile-doctor__city">
              <h5>Città *</h5>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="reg-profile-doctor__phone-number">
              <h6>Telefono *</h6>
              <PhoneInput
                country={"it"}
                value={phone}
                onChange={setPhone}
                enableSearch={true}
                preferredCountries={["it", "us", "gb"]}
                inputClass="reg-profile-doctor__input"
                containerClass="reg-profile-doctor__input-container"
              />
              <div className="reg-profile-doctor__info-phone">
                <p>
                  Seleziona il prefisso del tuo Paese e inserisci il{" "}
                  <b>numero di cellulare</b>. Il numero fornito verrà utilizzato
                  per contattarti solo da MedHUB.
                </p>
              </div>
            </div>

            <div className="reg-profile-doctor__email">
              <h5>Email *</h5>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="reg-profile-doctor__psw">
              <h6>Password *</h6>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  onFocus={() => setShowMessagePsw(true)}
                  onBlur={() => setShowMessagePsw(false)}
                  className="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password-icon-doc"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              {showMessagePsw && (
                <div className="password-checker">
                  <p>Come creare una password sicura?</p>
                  <ul>
                    {passwordRequirements.map((req, idx) => {
                      const passed = req.test(password);
                      return (
                        <li
                          key={idx}
                          className={passed ? "psw-passed" : "psw-denied"}
                        >
                          <span>
                            {passed ? (
                              <FontAwesomeIcon icon={faCheckCircle} />
                            ) : (
                              <FontAwesomeIcon icon={faMinusCircle} />
                            )}
                          </span>
                          <span>{req.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="reg-profile-doctor__ordine">
              <h6>Numero di iscrizione all'Ordine *</h6>
              <input
                type="text"
                value={ordine}
                onChange={(e) => setOrdine(e.target.value)}
              />
              <h6 style={{ paddingTop: "35px" }}>Ordine di *</h6>
              <input
                type="text"
                value={ordinePlace}
                onChange={(e) => setOrdinePlace(e.target.value)}
              />
            </div>

            <div className="reg-profile-doctor__btn-submit">
              <button disabled={!isValid()} onClick={handleVerifyDoctor}>
                Registrati gratuitamente
              </button>
            </div>

            <div className="reg-profile-doctor__privacy">
              <hr />
              <p>
                Registrandoti acconsenti ai nostri Termini e Condizioni e
                confermi di aver letto e compreso la nostra Privacy Policy.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-4 reg-profile-doctor__img">
            <img src={doctor_img} alt="Doctor bro" />
          </div>
        </div>
      </div>
    </>
  );
}
