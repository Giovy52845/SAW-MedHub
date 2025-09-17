import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import { useAuth } from "../../AuthContext.jsx";
import { getDomanda, postDomanda, putRispostaSanitario } from "../../api/api";
import { postInvioNotifica } from "../../api/notifiche.js";
import { StarRating } from "../../components/ReviewsWidget/ReviewsWidget.jsx";
import logo from "../../assets/img/navbar_image.png";
import TextareaDomanda from "../../components/TextareaDomanda/TextareaDomanda.jsx";
import "./DomandaSingola.css";

export default function DomandaSingola() {
  const { idDomanda } = useParams();
  const [domanda, setDomanda] = useState(null);
  const { userData } = useAuth();

  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [risposta, setRisposta] = useState("");

  useEffect(() => {
    if (!idDomanda) return;

    getDomanda(idDomanda)
      .then((data) => setDomanda(data))
      .catch((err) =>
        console.error("Errore nel recupero della domanda: ", err)
      );
  }, [idDomanda]);

  async function handleInvioRisposta() {
    if (!userData?.uid) {
      toast.error("Effettua il login per rispondere o porre altre domande.");
      return;
    }

    if (risposta === "") {
      toast.warning("Scrivi qualcosa prima di inviare.");
      return;
    }

    if (userData?.ruolo === "paziente") {
      // Creo una nuova domanda
      try {
        const newDomanda = {
          idAutore: userData?.uid,
          testoDomanda: risposta,
          dataDomanda: new Date(),
        };

        postDomanda(newDomanda);
        toast.success("Domanda inviata con successo.");
        navigate("/domande-risposte/");
      } catch (err) {
        console.error("Si è verificato un errore: ", err);
        toast.error("Si è verificato un errore. Riprova tra poco.");
      }

      return;
    } else {
      // Invio la risposta del sanitario
      try {
        const nuovaRisposta = {
          idDomanda,
          idSan: userData?.uid,
          risposta,
          dataRisposta: new Date(),
        };
        await putRispostaSanitario(nuovaRisposta);
        toast.success("Risposta inviata con successo.");

        // Invio la notifica all'utente
        const message = {
          userId: domanda.idAutore,
          role: "paziente",
          title: "Nuova risposta",
          body: `Hai una nuova risposta alla tua domanda`,
          url: `/domande-risposte/${idDomanda}`,
          type: "question",
          actions: JSON.stringify([
            { action: "open", title: "Apri" },
            { action: "dismiss", title: "Chiudi" },
          ]),
        };

        // Invio la notifica
        const invioNot = await postInvioNotifica(message);

        // Aggiorno la domanda
        await getDomanda(nuovaRisposta.idDomanda)
          .then((data) => setDomanda(data))
          .catch((err) =>
            console.error("Errore nel fetch della domanda: ", err)
          );
      } catch (err) {
        console.error("Si è verificato un errore: ", err);
        toast.error("Si è verificato un errore. Riprova tra poco.");
      }
      return;
    }
  }

  return (
    <div className="container-fluid domanda-fluid">
      <div className="navbar-domande">
        <div className="navbar-indietro">
          <button onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
        <div className="navbar-logo">
          <Link to={"/"}>
            <img src={logo} alt="Logo MedHUB" />
          </Link>
        </div>
      </div>
      <div className="container domande-container">
        <div className="chat-box-title">
          <h3>{domanda?.testoDomanda.substring(0, 85)}...</h3>
          <p>
            {domanda?.risposte.length}{" "}
            {domanda?.risposte.length == 1 ? "risposta" : "risposte"}
          </p>
        </div>
        <div className="chat-box-user-dom">
          <p className="box-text">{domanda?.testoDomanda}</p>
        </div>
        <div className="thread">
          {!domanda?.risposte || domanda.risposte.length === 0 ? (
            <div className="thread-risposta">
              <h3>Non ci sono ancora risposte per questa domanda.</h3>
            </div>
          ) : (
            domanda.risposte.map((data, index) => (
              <div key={index} className="thread-risposta">
                <div className="row">
                  <div className="col-lg-9 chat-text-san">
                    <p>{data.risposta}</p>
                  </div>
                  <div className="col-lg-3 info-san">
                    <div className="risposta-san-info">
                      <div className="risposta-img">
                        <img src={data.fotoProfilo} />
                      </div>
                      <div className="risposta-info">
                        <p>
                          <strong>{data.nomeCognome}</strong>
                        </p>
                        <p>{data.spec}</p>
                        <StarRating rating={data.valMedia} />
                        <p>{data.citta}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="container footer-risposte">
        <div>
          <h4>
            {userData?.ruolo === "paziente"
              ? "Stai ancora cercando una risposta? Poni un'altra domanda"
              : "Rispondi alla domanda!"}
          </h4>
          <TextareaDomanda
            inputRef={inputRef}
            data={risposta}
            setData={setRisposta}
            handleBtn={handleInvioRisposta}
            ruolo={userData?.ruolo}
          />
        </div>
      </div>
    </div>
  );
}
