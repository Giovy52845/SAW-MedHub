import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../AuthContext";
import { getPazientiSanitario, getAppuntamentiSanitario } from "../../api/api";
import NavbarSanitario from "../../components/Navbar/NavbarSanitario";

import "./ListaPazienti.css";

export default function ListaPazienti() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const [pazienti, setPazienti] = useState([]);
  const [query, setQuery] = useState("");
  const [ordine, setOrdine] = useState("");
  const [appuntamenti, setAppuntamenti] = useState([]);

  const pazientiFiltrati = pazienti.filter((p) => {
    const testo = query.toLowerCase();
    const nomeCognome = (p.nomeCognome || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    return nomeCognome.includes(testo) || email.includes(testo);
  });

  const pazientiOrdinati = [...pazientiFiltrati].sort((a, b) => {
    if (ordine === "alfabetico") {
      return (a.nomeCognome || "").localeCompare(b.nomeCognome || "");
    }
    if (ordine === "data") {
      return new Date(b.dataUltimoApp) - new Date(a.dataUltimoApp);
    }
    if (ordine === "appuntamenti") {
      return (b.conteggioApp || 0) - (a.conteggioApp || 0);
    }
    return 0; // nessun ordinamento di default
  });

  useEffect(() => {
    if (!userData?.uid) return;

    getPazientiSanitario(userData?.uid)
      .then((data) => setPazienti(data))
      .catch((err) => console.error("Si è verificato un errore: ", err));
  }, [userData?.uid]);

  useEffect(() => {
    if (!userData?.uid) return;
    getAppuntamentiSanitario(userData?.uid)
      .then((data) => setAppuntamenti(data))
      .catch((err) => console.error("Si è verificato un errore: ", err));
  }, [userData?.uid]);

  function handleRefertoAperto(idAppuntamento, idSan, idPaz) {
    navigate(`/referto/${idAppuntamento}/${idSan}/${idPaz}`);
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <NavbarSanitario />
        </div>
        <div className="col-md-10 lista-pazienti__container">
          <div className="lista-pazienti__wrapper">
            <h3>👤 Elenco pazienti</h3>
            <h4 className="mt-4">
              📊 Hai{" "}
              <span style={{ color: "#2563eb", fontWeight: 600 }}>
                {pazienti.length}{" "}
                {pazienti.length === 1 ? "paziente" : "pazienti"}
              </span>{" "}
              registrati.
            </h4>
            <div className="divider">
              <hr />
            </div>
            <div className="lista-pazienti__ricerca">
              <input
                className="pazienti-filtro"
                placeholder="🔍 Cerca per nome, cognome o email:"
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="pazienti-ordine">
                <h5>Ordina:</h5>
                <button
                  className={`ordine-btn alfabetico ${
                    ordine === "alfabetico" ? "active" : ""
                  }`}
                  onClick={() => setOrdine("alfabetico")}
                >
                  Alfabetico
                </button>
                <button
                  className={`ordine-btn data ${
                    ordine === "data" ? "active" : ""
                  }`}
                  onClick={() => setOrdine("data")}
                >
                  Per data
                </button>
                <button
                  className={`ordine-btn appuntamenti ${
                    ordine === "appuntamenti" ? "active" : ""
                  }`}
                  onClick={() => setOrdine("appuntamenti")}
                >
                  Per numero appuntamenti
                </button>
              </div>
            </div>
            {pazientiOrdinati.length > 0 ? (
              pazientiOrdinati.map((data, index) => (
                <div key={index} className="card lista-pazienti-item">
                  <div className="lista-pazienti-header">
                    <h5> 👤 {data.nomeCognome} </h5>
                    <h5> ✉️ {data.email} </h5>
                  </div>
                  <div className="lista-pazienti-body">
                    <h5>
                      🗓️ Ultimo appuntamento:{" "}
                      {formattaDataIt(data.dataUltimoApp)}
                    </h5>
                    <h5>🧑‍⚕️ Modalità: {data.tipoUltimoApp}</h5>
                    <h5>📌 Prestazione: {data.prestUltimoApp}</h5>
                  </div>
                  <div className="lista-pazienti-footer">
                    <h5>📊 Totale appuntamenti: {data.conteggioApp}</h5>
                  </div>

                  <div className="lista-pazienti-btn">
                    <button
                      onClick={() =>
                        handleRefertoAperto(
                          data.idUltimoApp,
                          userData?.uid,
                          data.idPaz
                        )
                      }
                      disabled={new Date(data.dataUltimoApp) > new Date()}
                      title={
                        new Date(data.dataUltimoApp) > new Date()
                          ? "Il referto sarà disponibile il giorno della visita"
                          : "Scrivi il referto"
                      }
                      className={`ordine-btn ref ${
                        new Date(data.dataUltimoApp) > new Date()
                          ? "active"
                          : ""
                      }`}
                    >
                      {new Date(data.dataUltimoApp) > new Date() ? "🔒" : " 📝"}{" "}
                      Scrivi referto
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-no-pazienti">
                {" "}
                🫥 Nessun paziente disponibile al momentio
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  
  function formattaDataIt(dataString) {
    const mesi = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ];

    const [anno, mese, giorno] = dataString.split("-");
    return `${giorno} ${mesi[parseInt(mese, 10) - 1]} ${anno}`;
  }
}
