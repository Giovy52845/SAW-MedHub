import { useEffect, useState } from "react";
import { getSanitarioData, getSpecialistiche } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faP, faPen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import "./widget.css";

export default function ProfiloWidget({ uid }) {
  const [userData, setUserData] = useState(null);
  const [specialistiche, setSpecialistiche] = useState(null);
  const specializzazioneNome = specialistiche
    ? specialistiche.find((item) => item.id === userData?.specializzazione)
        ?.nome || ""
    : "";

  useEffect(() => {
    getSanitarioData(uid)
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.error("Errore impossibile recuperare i dati.", err);
      });
      
    getSpecialistiche()
      .then((data) => {
        setSpecialistiche(data);
      })
      .catch((err) => {
        console.error("Errore nel caricamento delle specialistiche.");
      });
  }, [uid]);

  return (
    <div className="sanitario-widget__box">
      <h3>Il tuo profilo:</h3>
      <div className="profile-widget__header">
        <div className="profile-widget__header-img">
          <img src={userData?.fotoProfiloURL} alt="Immagine di profilo" />
        </div>
        <div className="profile-widget__header-title">
          <h4>
            {userData?.nome.toUpperCase()} {userData?.cognome.toUpperCase()}
          </h4>
          <h5>{specializzazioneNome}</h5>
          <h5>{userData?.formazione}</h5>
        </div>
      </div>
      <div className="profile-widget__body">
        <p>Competenze: {userData?.comp_specifiche}</p>
        <p>Esperienza: {userData?.anni_esperienza} anno</p>
        <p>
          Studio: {userData?.modalita_visita?.indirizzo},{" "}
          {userData?.modalita_visita?.citta}
        </p>
      </div>
      <div className="profile-widget__footer">
        <Link to={"/tuo-account/impostazioni"}>
          <button>
            <FontAwesomeIcon icon={faPen} />
            Modifica il profilo
          </button>
        </Link>
      </div>
    </div>
  );
}
