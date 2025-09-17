import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faVideo,
  faBuilding,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

import MyNavbar from "../../components/Navbar/MyNavbar";
import { StarRating } from "../../components/ReviewsWidget/ReviewsWidget";
import {
  getSpecialistiche,
  getPaziente,
  putSanitarioPreferiti,
  deleteSanitarioPreferiti,
  checkPreferitoSalvato,
} from "../../api/api";
import MappaIndirizzo from "../../components/MappaIndirizzo/MappaIndirizzo";
import RecensioniSanitario from "../../components/RecensioniSanitario/RecensioniSanitario";
import ModuloPrenotazione from "../../components/ModuloPrenotazione/ModuloPrenotazione";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../AuthContext";

import "./ProfiloSanitario.css";

export default function ProfiloSanitario() {
  const navigate = useNavigate();

  // Recupero i dati dell'utente
  const { userData } = useAuth();
  const [profiloUtente, setProfiloUtente] = useState(null);

  const { slug } = useParams();
  const [sanitario, setSanitario] = useState(null);
  const [specialistiche, setSpecialistiche] = useState("");
  const specializzazioneNome = specialistiche
    ? specialistiche.find((item) => item.id === sanitario?.specializzazione)
        ?.nome || ""
    : "";
  const [salvato, setSalvato] = useState(false);

  const [activeTab, setActiveTab] = useState("studio");

  useEffect(() => {
    async function fetchSanitario() {
      const q = query(collection(db, "sanitari"), where("slug", "==", slug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setSanitario(querySnapshot.docs[0].data());
      }
    }
    fetchSanitario();
  }, [slug]);

  useEffect(() => {
    getSpecialistiche()
      .then((data) => setSpecialistiche(data))
      .catch((err) => console.error("Si è verificato un errore.", err));
  }, [sanitario]);

  useEffect(() => {
    if (!userData?.uid) return;
    if (userData?.ruolo === "sanitario") {
      navigate("/");
    }
  }, [userData?.uid]);

  useEffect(() => {
    if (!userData?.uid || !sanitario?.uid) return;

    async function fetchDati() {
      try {
        const paziente = await getPaziente(userData.uid);
        setProfiloUtente(paziente);

        const isSalvato = await checkPreferitoSalvato(
          userData.uid,
          sanitario.uid
        );
        setSalvato(isSalvato);
      } catch (err) {
        console.error("Errore durante il caricamento dei dati:", err);
      }
    }

    fetchDati();
  }, [userData?.uid, sanitario?.uid]);

  if (!sanitario) return <p>Caricamento...</p>;

  async function toggleSalva() {
    if (!userData) {
      alert("Devi essere loggato per salvare nei preferiti.");
      return;
    }
    try {
      if (salvato) {
        await deleteSanitarioPreferiti(profiloUtente?.uid, sanitario?.uid);
        setSalvato(false);
      } else {
        const preferito = {
          uid: sanitario?.uid,
          nome: sanitario?.nome,
          cognome: sanitario?.cognome,
          slug: sanitario?.slug,
          spec: sanitario?.specializzazione,
          imgURL: sanitario?.fotoProfiloURL,
        };
        await putSanitarioPreferiti(profiloUtente?.uid, preferito);
        setSalvato(true);
      }
    } catch (error) {
      console.error("Errore nel toggle preferiti:", error);
      alert("Si è verificato un errore.");
    }
  }

  return (
    <>
      <div className="container-fluid profilo-sanitario__container-fluid">
        <MyNavbar />

        <div className="container">
          <div className="row">
            <div className="col-md-8 profilo-sanitario__wrapper">
              <div className="profilo-sanitario__header">
                <div className="profilo-sanitario__img">
                  <img
                    src={sanitario?.fotoProfiloURL}
                    alt={`Immagine profilo ${sanitario.slug}`}
                  />
                </div>
                <div className="profilo-sanitario__info">
                  <h3>
                    {sanitario?.nome.toUpperCase()}{" "}
                    {sanitario?.cognome.toUpperCase()}
                  </h3>
                  <h4>{specializzazioneNome}</h4>
                  <p>{sanitario?.comp_specifiche}</p>
                  <p>📍 {sanitario.citta.toUpperCase()}</p>
                  <div className="profilo-sanitario__valutazione">
                    <StarRating rating={sanitario?.valutazioneMedia} />
                    <p>{sanitario?.recensioniCount} recensione</p>
                  </div>
                </div>
                {/* DA MODIFICARE */}
                <div className="profilo-sanitario__salvato">
                  <button onClick={toggleSalva} className="save-button">
                    <FontAwesomeIcon
                      icon={salvato ? solidHeart : regularHeart}
                    />
                  </button>
                </div>
              </div>
              <div className="profilo-sanitario__container">
                <div className="profilo-sanitario__bio">
                  <h4>Mi presento</h4>
                  <p>{sanitario?.bio}</p>
                </div>
                <div className="profilo-sanitario__esperienze">
                  <h4>Esperienze</h4>
                  <p>{sanitario?.formazione}</p>
                </div>
                <div className="profilo-sanitario__comp-specifiche">
                  <h4>Patologie trattate</h4>
                  <p>{sanitario?.comp_specifiche}</p>
                </div>
              </div>

              <div className="profilo-sanitario__tabs">
                <ul className="nav nav-tabs profilo-sanitario__custom-tabs">
                  {sanitario?.modalita_visita.online ? (
                    <li className="nav-item" key="online">
                      <button
                        className={`nav-link profilo-sanitario__custom-link ${
                          activeTab === "online" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("online")}
                      >
                        <FontAwesomeIcon icon={faVideo} />
                        Online
                      </button>
                    </li>
                  ) : (
                    ""
                  )}
                  {sanitario?.modalita_visita.studio ? (
                    <li className="nav-item" key="studio">
                      <button
                        className={`nav-link profilo-sanitario__custom-link ${
                          activeTab === "studio" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("studio")}
                      >
                        <FontAwesomeIcon icon={faBuilding} />
                        Indirizzo
                      </button>
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
                {activeTab === "online" && (
                  <div className="box-online">
                    <h5 className="titolo-sezione">💻 Consulenza online</h5>
                    <p className="testo-descrizione">
                      Grazie alle consulenze online, centinaia di pazienti
                      stanno già beneficiando dell'aiuto di uno specialista
                      senza muoversi da casa.
                      <br />
                      <br />
                      Prova anche tu e ottieni il supporto di un professionista,
                      proprio come nelle visite tradizionali. Non devi
                      preoccuparti di nulla, se hai qualche dubbio potrai
                      chiedere allo specialista prima della consulenza. Ti
                      invieremo i dettagli di contatto insieme alla conferma
                      della tua prenotazione.
                    </p>
                    <div className="nota-pagamento">
                      <FontAwesomeIcon icon={faCreditCard} /> Pagamento dopo la
                      consulenza
                    </div>
                  </div>
                )}

                {activeTab === "studio" && (
                  <div className="box-studio">
                    <div className="studio-indirizzo">
                      <h5>{sanitario?.modalita_visita.indirizzo}</h5>
                      <h6>{sanitario?.modalita_visita.citta}</h6>
                    </div>
                    <div className="studio-mappa">
                      <MappaIndirizzo
                        indirizzo={`${sanitario?.modalita_visita.indirizzo} ${sanitario?.modalita_visita.citta}}`}
                      />
                    </div>
                  </div>
                )}
                <div className="box-info__generali">
                  <h5>Telefono</h5>
                  <h6>+ {sanitario?.telefono}</h6>
                </div>
              </div>
              <div className="profilo-sanitario__tariffe">
                <h5>Prestazioni e prezzi</h5>
                <div className="lista-prestazioni">
                  {sanitario?.prestazioni.map(
                    (data, index) =>
                      (data.nome !== "" || data.prezzo !== "") && (
                        <div className="prestazione" key={index}>
                          <span className="nome-prestazione">{data.nome}</span>
                          <span className="prezzo-prestazione">
                            {data.prezzo} €
                          </span>
                        </div>
                      )
                  )}
                </div>
              </div>

              <div className="profilo-sanitario__recensioni">
                <RecensioniSanitario uid={sanitario?.uid} />
              </div>
            </div>
            <div className="col-md-4 profilo-sanitario__appuntamenti">
              <ModuloPrenotazione
                uidSan={sanitario?.uid}
                uidPaz={profiloUtente?.uid}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
