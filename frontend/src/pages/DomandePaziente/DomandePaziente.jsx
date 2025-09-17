import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import PazienteSettingsSidebar from "../../components/PazienteSettingsSidebar/PazienteSettingsSidebar";
import NavbarAccount from "../../components/Navbar/NavbarAccount";
import { useAuth } from "../../AuthContext";
import { getListaDomandePaziente } from "../../api/api";
import "./DomandePaziente.css";

export default function DomandeSanitario() {
  const { userData } = useAuth();
  const [listaDomande, setListaDomande] = useState([]);

  useEffect(() => {
    if (!userData?.uid) return;

    getListaDomandePaziente(userData.uid)
      .then((data) => setListaDomande(data))
      .catch((err) => console.error("Si è verificato un errore: ", err));
  }, [userData?.uid]);

  return (
    <div className="domande-paziente__wrapper">
      <div className="container domande-paziente__container">
        <NavbarAccount email={userData?.email} />
        <div className="row">
          <PazienteSettingsSidebar />

          <div className="col-lg-9 domande-paziente__item">
            <div className="domande-paziente__header">
              <h3>Le tue domande</h3>
            </div>
            {listaDomande.length === 0 ? (
              <div className="domande-paziente__no-domande">
                <p>
                  🐾 Nessuna domanda ancora… lascia il tuo primo messaggio e
                  inizia la conversazione!
                </p>
                <div className="no-domande-btn">
                  <Link to={"/domande-risposte"}>
                    ➕ Fai la tua prima domanda
                  </Link>
                </div>
              </div>
            ) : (
              listaDomande.map((data) => (
                <div key={data.id} className="card domande-paziente-show">
                  <div className="paziente-risposta-header">
                    <div className="risposte-counter">
                      {data.risposte.length === 0 ? (
                        <p>⏳ In attesa di risposte</p>
                      ) : (
                        <p>
                          📩 [{data.risposte.length}{" "}
                          {data.risposte.length === 1 ? "risposta" : "risposte"}
                          ]
                        </p>
                      )}
                    </div>
                    <div className="risposta-data">
                      <p>
                        {new Date(data.dataDomanda).toLocaleDateString(
                          "it-IT",
                          { day: "2-digit", month: "short", year: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="paziente-risposta-body">
                    <p className="truncate-paz">"{data.testoDomanda}"</p>
                  </div>
                  {data.risposte.length > 0 ? (
                    <div className="paziente-risposta-footer">
                      <div className="risposta-footer-data">
                        <p>
                          🕰️ Ultima risposta:{" "}
                          {new Date(
                            data.risposte[data.risposte.length - 1].dataRisposta
                          ).toLocaleDateString("it-IT", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="risposta-footer-autore">
                        <p>
                          Autore:{" "}
                          {data.risposte[data.risposte.length - 1].nomeCognome}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="risposta-visualizza">
                    <Link to={`/domande-risposte/${data.id}`}>Visualizza</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
