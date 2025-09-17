import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./widget.css";
import { getPazientiSanitario } from "../../../api/api";

export default function PazientiWidget({ uid }) {
  const [lsPazienti, setLsPazienti] = useState([]);

  useEffect(() => {
    if (!uid) return;

    getPazientiSanitario(uid)
      .then((data) => setLsPazienti(data))
      .catch((err) => console.error("Errore: ", err));
  }, [uid]);

  return (
    <div className="sanitario-widget__box">
      <h3>I tuoi pazienti</h3>
      {lsPazienti.length === 0 ? (
        <p>Al momento non hai nessun paziente</p>
      ) : (
        <>
          {lsPazienti.slice(0, 3).map((data, index) => (
            <div className="pazienti-widget-item" key={index}>
              <p>
                👤 <strong>Nome: </strong>
                {data.nomeCognome || "Anonimo"}
              </p>
              <p>
                📅 <strong>Ultimo appuntamento: </strong> {data.dataUltimoApp}
              </p>
            </div>
          ))}
          <div className="btn-lista-pazienti">
            <Link to={"/pazienti"}>Vedi tutti</Link>
          </div>
        </>
      )}
    </div>
  );
}
