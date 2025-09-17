import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faReply, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import { useAuth } from "../../AuthContext";
import {
  getSanitarioData,
  getListaDomande,
  putIgnoraDomanda,
} from "../../api/api";

import NavbarSanitario from "../../components/Navbar/NavbarSanitario.jsx";
import domande from "../../assets/img/domande.png";
import "./DomandeSanitario.css";

export default function DomandeSanitario() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [sanitario, setSanitario] = useState(null);
  const [listaDomande, setListaDomande] = useState([]);

  const listaDomandeFiltrate = useMemo(() => {
    const uid = sanitario?.uid;
    return listaDomande.filter(
      (d) =>
        !Array.isArray(d.ignorataDa) ||
        (uid ? !d.ignorataDa.includes(uid) : true)
    );
  }, [listaDomande, sanitario?.uid]);

  useEffect(() => {
    if (!userData?.uid) return;

    getSanitarioData(userData.uid)
      .then((data) => setSanitario(data))
      .catch((err) => console.error("Errore: ", err));
  }, [userData?.uid]);

  useEffect(() => {
    if (!sanitario?.uid) return;

    const unsubscribe = getListaDomande((data) => {
      setListaDomande(data);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [sanitario?.uid]);

  // Funzione per ignorare una domanda
  async function handleIgnora(idSan, idDomanda) {
    try {
      // Tolgo subito dalla lista per questo sanitario
      setListaDomande((prev) =>
        prev.map((d) =>
          d.idDomanda === idDomanda
            ? {
                ...d,
                ignorataDa: [...(d.ignorataDa || []), idSan],
              }
            : d
        )
      );

      await putIgnoraDomanda(idSan, idDomanda);
      toast.success("Domanda ignorata con successo.");

    } catch (err) {
      console.error(err);
      toast.error("Si è verificato un errore. Riprova tra poco.");

      setListaDomande((prev) =>
        prev.map((d) =>
          d.idDomanda === idDomanda
            ? {
                ...d,
                ignorataDa: (d.ignorataDa || []).filter((x) => x !== idSan),
              }
            : d
        )
      );
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <NavbarSanitario />
        </div>
        <div className="col-md-7 lista-domande-san">
          <h3>Domande dei pazienti</h3>
          <p>
            Leggi le richieste anonime ricevute e rispondi secondo la tua
            specializzazione.
          </p>
          {listaDomandeFiltrate?.length === 0 ? (
            <div className="domande__no-domande">
              <p>Non ci sono domande a cui rispondere</p>
            </div>
          ) : (
            listaDomandeFiltrate.map((data, index) => (
              <div key={index} className="card lista-domande-item">
                <div className="lista-domande-txt">
                  <p>{data.testoDomanda.substring(0, 100)}...</p>
                  <p>
                    Inviata il:{" "}
                    {new Date(data.dataDomanda).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="lista-domande-btn">
                  <button
                    className="btn-domande visualizza"
                    onClick={() =>
                      navigate(`/domande-risposte/${data.idDomanda}`)
                    }
                  >
                    <FontAwesomeIcon icon={faEye} /> Visualizza
                  </button>

                  <button
                    className="btn-domande ignora"
                    onClick={() => handleIgnora(sanitario?.uid, data.idDomanda)}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Ignora
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="col-md-3 lista-domande-img">
          <img src={domande} />
        </div>
      </div>
    </div>
  );
}
