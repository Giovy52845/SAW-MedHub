import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMars,
  faVenus,
  faGenderless,
} from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import {toast} from "react-toastify"


import { useAuth } from "../../AuthContext.jsx";
import NavbarAccount from "../../components/Navbar/NavbarAccount.jsx";
import PazienteSettingsSidebar from "../../components/PazienteSettingsSidebar/PazienteSettingsSidebar.jsx";
import NotificheButton from "../../features/notifiche/NotificheButton.jsx";

import "./TuoAccount.css";
import { useState } from "react";
import { useEffect } from "react";
import { deleteUser, getAuth } from "firebase/auth";
import { getPaziente, putDatiPaziente, deletePaziente } from "../../api/api.js";

export default function TuoAccountPazienti() {
  const navigate = useNavigate();

  const { userData, loading } = useAuth();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [firma, setFirma] = useState("");
  const [city, setCity] = useState("");
  const [dataNascita, setDataNascita] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  const [userDataDB, setUserDataDB] = useState(null);

  /*
     Carica i dati nei placeholder prendendoli dal DB
    */
  useEffect(() => {
    getPaziente(userData.uid)
      .then((data) => setUserDataDB(data))
      .catch((err) => console.error("Si è verificato un errore:", err));
  }, [userData?.uid]);

  /*
     Carica i dati nei relativi input
    */
  useEffect(() => {
    if (userDataDB?.gender) {
      setGender(userDataDB.gender);
    }
    if (userDataDB?.telefono) {
      setPhone(userData.telefono);
    }
  }, [userDataDB]);

  /*
     Funzione che resetta gli input
    */
  function handleAnnulla() {
    setName("");
    setSurname("");
    setFirma("");
    setCity("");
    setDataNascita("");
    setGender("");
    setPhone("");
    setEmail("");
  }

  /*
     Funzione per cancellare l'account sia da Firestore che da Firebase Auth
    */
  async function handleDeleteAccount() {
    const confirmDelete = window.confirm(
      "Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata."
    );
    if (confirmDelete) {
        try{
            await deletePaziente(userData.uid);
            toast.success("Account cancellato con successo.");
            navigate("/");
        } catch(err) {
            toast.error("Si è verificato un errore nella cancellazione dell'account.");
            console.error("Errore: ", err);
        }
    }
  }

  /* 
     Funzione per salvare i dati modificati
  */
  async function handleSaveChanges() {
    const updatedData = {
      nome: name || userDataDB?.nome,
      cognome: surname || userDataDB?.cognome,
      firma: firma || userDataDB?.firma,
      citta: city || userDataDB?.citta,
      dataNascita: dataNascita || userDataDB?.dataNascita,
      gender: gender || userDataDB?.gender,
      telefono: phone || userDataDB?.telefono,
    };
    try {
        await putDatiPaziente(userData.uid, updatedData);
        toast.success("Dati aggiornati correttamente.");
        navigate("/tuo-account/impostazioni");
    } catch(err) {
        toast.error("Si è verificato un errore nell'aggiornamento dei dati. Riprova più tardi");
        console.error("Errore: ", err);
    }
  }

  const handleNotificheChange = async (enabled, token) => {
    setUserDataDB((prev) => ({ ...prev, notifiche: enabled }));
  };

  return (
    <div className="tuo-account-paziente__container">
      <div className="container tuo-account-paziente__wrapper">
        <NavbarAccount email={userData?.email} />
        <div className="row">
          <PazienteSettingsSidebar />

          <div className="tuo-account-paziente__card-info col-lg-9">
            <div className="tuo-account-notifiche">
              <h4>Notifiche</h4>
              <div className="paziente-card__input row">
                <div className="col-lg-3 paziente-card__label">
                  <h6>Abilita le notifiche</h6>
                </div>
                <div className="col-lg-9 paziente-card__field">
                  <NotificheButton
                    uid={userData?.uid}
                    ruolo={userData?.ruolo}
                    initialChecked={!!userDataDB?.notifiche}
                    onChange={handleNotificheChange}
                  />
                </div>
              </div>
            </div>
            <div className="row divider-prova"></div>
            <h4>Impostazioni dell'account</h4>
            <p className="paziente-card-p">Qui puoi modificare i tuoi dati</p>
            <div className="paziente-card__input row">
              <div className="col-lg-3 paziente-card__label">
                <h6>Nome</h6>
              </div>
              <div className="col-lg-9 paziente-card__field">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={userDataDB?.nome || ""}
                />
              </div>
            </div>
            <div className="paziente-card__input row">
              <div className="col-lg-3 paziente-card__label">
                <h6>Cognome</h6>
              </div>
              <div className="col-lg-9 paziente-card__field">
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder={userDataDB?.cognome || ""}
                />
              </div>
            </div>
            <div className="paziente-card__input row">
              <div className="col-lg-3 paziente-card__label">
                <h6>Cambia firma</h6>
              </div>
              <div className="col-lg-9 paziente-card__field">
                <input
                  type="text"
                  value={firma}
                  onChange={(e) => setFirma(e.target.value)}
                  placeholder={userDataDB?.firma || ""}
                />
              </div>
            </div>
            <div className="paziente-card__input row">
              <div className="col-lg-3 paziente-card__label">
                <h6>Città</h6>
              </div>
              <div className="col-lg-9 paziente-card__field">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={userDataDB?.citta || ""}
                />
              </div>
            </div>
            <div className="paziente-card__input row">
              <div className="col-lg-3 paziente-card__label">
                <h6>Data di nascita</h6>
              </div>
              <div className="col-lg-9 paziente-card__field">
                <input
                  type="date"
                  value={dataNascita}
                  onChange={(e) => setDataNascita(e.target.value)}
                />
              </div>
            </div>
            <div className="paziente-card__input row">
              <div className="col-lg-3 paziente-card__label">
                <h6>Gender</h6>
              </div>
              <div className="col-lg-9 paziente-card__field-btn">
                <div className="row">
                  <div className="col-lg-3 paziente-card__btn-gender">
                    <button
                      value="male"
                      onClick={(e) => setGender(e.target.value)}
                      className={`btn-male ${
                        gender === "male" ? "active" : ""
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faMars}
                        onClick={(e) => setGender(e.target.value)}
                      />
                      Maschio
                    </button>
                  </div>
                  <div className="col-lg-3 paziente-card__btn-gender">
                    <button
                      value="female"
                      onClick={(e) => setGender(e.target.value)}
                      className={`btn-female ${
                        gender === "female" ? "active" : ""
                      }`}
                    >
                      <FontAwesomeIcon icon={faVenus} />
                      Femmina
                    </button>
                  </div>
                  <div className="col-lg-3 paziente-card__btn-gender">
                    <button
                      value="altro"
                      onClick={(e) => setGender(e.target.value)}
                      className={`btn-altro ${
                        gender === "altro" ? "active" : ""
                      }`}
                    >
                      <FontAwesomeIcon icon={faGenderless} />
                      Altro/Non binario
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="paziente-card__input row">
              <div className="col-lg-3 paziente-card__label d-flex align-items-center">
                <h6>Telefono</h6>
              </div>
              <div className="col-lg-9 paziente-card__field">
                <PhoneInput
                  placeholder="PROVA"
                  country={"it"}
                  value={phone}
                  onChange={setPhone}
                  enableSearch={true}
                  preferredCountries={["it", "us", "gb"]}
                  inputClass="paziente-card__phone-input"
                  containerClass="paziente-card__phone-container"
                />
              </div>
            </div>
            <div className="row divider-prova"></div>
            <div className="paziente-card__footer">
              <div className="row">
                <div className="col-lg-4 paziente-card__footer-left">
                  <button
                    className="paziente-card__submit-btn"
                    onClick={() => handleSaveChanges()}
                  >
                    Salva
                  </button>
                  <button
                    className="paziente-card__cancel-btn"
                    onClick={handleAnnulla}
                  >
                    Annulla
                  </button>
                </div>
                <div className="col-lg-8 paziente-card__footer-right">
                  <button
                    className="paziente-card__cancel-account-btn"
                    onClick={handleDeleteAccount}
                  >
                    Elimina Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
