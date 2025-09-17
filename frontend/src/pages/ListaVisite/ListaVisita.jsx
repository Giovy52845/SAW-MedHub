import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faCalendarAlt,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../AuthContext";
import ascoltaAppuntamentiPAZ, {
  getPaziente,
  getSpecialistaInfo,
} from "../../api/api";
import NavbarAccount from "../../components/Navbar/NavbarAccount";
import PazienteSettingsSidebar from "../../components/PazienteSettingsSidebar/PazienteSettingsSidebar";

import "./ListaVisita.css";

export default function ListaVisita() {
  const location = useLocation();

  const navigate = useNavigate();
  const { userData } = useAuth();
  const [paziente, setPaziente] = useState(null);
  const [filtro, setFiltro] = useState("tutte");
  const [appuntamenti, setAppuntamenti] = useState([]);
  const [specialistaInfo, setSpecialistaInfo] = useState({});

  // Recupero i dati del paziente
  useEffect(() => {
    let isMounted = true;
    if (!userData?.uid) return;

    if (userData?.ruolo === "sanitario") {
      navigate("/");
    }
    // Recupero i dati del Paziente
    getPaziente(userData?.uid)
      .then((data) => {
        if (isMounted) {
          setPaziente(data);
        }
      })
      .catch((err) => console.error("Si è verificato un errore: ", err));

    return () => {
      isMounted = false;
    };
  }, [userData?.uid, userData?.ruolo]);

  useEffect(() => {
    if (!paziente?.uid) return;

    let isMounted = true;

    const unsubscribe = ascoltaAppuntamentiPAZ(paziente?.uid, (data) => {
      if (isMounted) {
        setAppuntamenti(data);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [paziente?.uid]);

  const appuntamentiFiltrati = appuntamenti
    .filter((app) => {
      const dataApp = new Date(app.timestamp.seconds * 1000);
      const oraAttuale = new Date();

      if (filtro === "future") {
        return dataApp >= oraAttuale && app.stato !== "cancellato";
      }

      if (filtro === "passate") {
        return dataApp < oraAttuale && app.stato !== "cancellato";
      }

      // filtro === "tutte"
      return app.stato !== "cancellato";
    })
    .sort((a, b) => {
      const dataA = new Date(a.timestamp.seconds * 1000);
      const dataB = new Date(b.timestamp.seconds * 1000);
      return dataA - dataB;
    });

  // Recupero le informazioni dei sanitari
  useEffect(() => {
    let isMounted = true;

    const idNonPresenti = appuntamentiFiltrati
      .map((app) => app.idSan)
      .filter((idSan) => !specialistaInfo[idSan]);

    idNonPresenti.forEach((idSan) => {
      getSpecialistaInfo(idSan, (info) => {
        if (isMounted) {
          setSpecialistaInfo((prev) => ({
            ...prev,
            [idSan]: info,
          }));
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, [appuntamentiFiltrati, specialistaInfo]);

  return (
    <div className="lista-visite__wrapper">
      <div className="container lista-visite__container">
        <NavbarAccount email={paziente?.email} />
        <div className="row">
          <PazienteSettingsSidebar />

          <div className="col-md-9 lista-visite" key={location.pathname}>
            <div className="lista-visite__header">
              <h3>Le mie visite</h3>
            </div>
            <div className="lista-visite__filtro">
              <h6>Filtri: </h6>
              <button
                className={`liste-filtro-btn tutte ${
                  filtro === "tutte" ? "active" : ""
                }`}
                onClick={() => setFiltro("tutte")}
              >
                <FontAwesomeIcon icon={faFilter} /> Tutte
              </button>
              <button
                className={`liste-filtro-btn future ${
                  filtro === "future" ? "active" : ""
                }`}
                onClick={() => setFiltro("future")}
              >
                <FontAwesomeIcon icon={faCalendarAlt} /> Future
              </button>
              <button
                className={`liste-filtro-btn passate ${
                  filtro === "passate" ? "active" : ""
                }`}
                onClick={() => setFiltro("passate")}
              >
                <FontAwesomeIcon icon={faSortDown} /> Passate
              </button>
            </div>
            {appuntamentiFiltrati.map((app, index) => (
              <div key={index} className="card liste-filtro-item">
                <div className="liste-filtro-data">
                  <h5>
                    📅
                    {new Date(app.data).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    - ore {app.hInizio}
                  </h5>
                </div>
                <div className="liste-filtro-nome">
                  <p className="liste-text nome-sanitario">
                    👨‍⚕️ <strong>Specialista: </strong>{" "}
                    <em>{specialistaInfo[app.idSan]}</em>
                  </p>
                </div>
                <div className="liste-filtro-luogo">
                  <p className="liste-text">
                    📍
                    {app.tipo === "online" ? (
                      <strong>La visita si svolge online.</strong>
                    ) : (
                      <strong>
                        La visita si svolge presso l'indirizzo del sanitario.
                      </strong>
                    )}
                  </p>
                </div>
                <div className="liste-filtro-prestazione">
                  <p className="liste-text">
                    💬 Prestazione:{" "}
                    {app?.prestazione || "Non hai inserito nessuna prestazione"}
                  </p>
                </div>
                <div className="list-filtro-stato">
                  {app.stato === "attesa" ? (
                    <p className="liste-text">🟡 In attesa di conferma.</p>
                  ) : (
                    ""
                  )}
                  {app.stato === "cancellato" ? (
                    <p className="liste-text">
                      🔴 Appuntamento cancellato / rifiutato{" "}
                    </p>
                  ) : (
                    ""
                  )}
                  {app.stato === "confermato" ? (
                    <p className="liste-text">🟢 Appuntamento confermato</p>
                  ) : (
                    ""
                  )}
                  {app.stato === "refertato" ? (
                    <p className="liste-text">📄 Appuntamento refertato</p>
                  ) : (
                    ""
                  )}

                  <div className="referto">
                    {app?.stato === "refertato" ? (
                      <a
                        href={app.refertoURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="referto-btn"
                      >
                        Visualizza referto
                      </a>
                    ) : (
                      <p className="liste-text referto">
                        Referto non ancora disponibile
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
