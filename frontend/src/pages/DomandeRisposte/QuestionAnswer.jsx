// Import componenti React e di terze parti
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCommentDots,
  faCommentAlt,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

// Import file locali
import { useAuth } from "../../AuthContext.jsx";
import { postDomanda } from "../../api/api.js";

import MyNavbar from "../../components/Navbar/MyNavbar.jsx";
import QuestionLast30Days from "../../components/QuestionLast30Days/QuestionLast30Days.jsx";
import img_chat from "../../assets/img/personal_msg.png";
import Footer from "../../components/Footer/Footer.jsx";

// File CSS
import "./QuestionAnswer.css";
import TextareaDomanda from "../../components/TextareaDomanda/TextareaDomanda.jsx";

export default function QuestionAnswer() {
  const num_request = 253571;
  const num_answer = 754011;
  const num_doctor = 53825;

  const [domanda, setDomanda] = useState("");

  const { userData } = useAuth();

  function handleInvioDomanda() {
    if (!userData?.uid) {
      toast.error("Prima di inviare la domanda devi effettuare il Login.");
      return;
    }

    if (domanda === "") {
      toast.warning("Inserisci una domanda prima di inviare.");
      return;
    }

    try {
      const newDomanda = {
        idAutore: userData?.uid,
        testoDomanda: domanda,
        dataDomanda: new Date(),
      };

      postDomanda(newDomanda);
      toast.success("Domanda inviata con successo.");
    } catch (err) {
      console.error("Si è verificato un errore: ", err);
      toast.error("Si è verificato un errore. Riprova tra poco.");
    }
  }

  return (
    <div className="question-answer-wrapper">
      <MyNavbar variant={"minimal"} />
      <div className="container py-3">
        <div className="qa-card-header">
          <div className="row">
            <div className="col-12 col-lg-7 order-2 order-lg-1 qa-header-text">
              <h3>Chiedi al dottore</h3>
              <p>
                Risolvi i tuoi dubbi riguardanti la salute chiedendo agli
                specialisti suggeriti.
              </p>
              <div className="qa-li-text">
                <p>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="me-2 qa-icon-circle"
                  />
                  Riceverai più risposte
                </p>
              </div>
              <div className="qa-li-text">
                <p>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="me-2 qa-icon-circle"
                  />
                  Generalmente entro 48h
                </p>
              </div>
              <div className="qa-li-text">
                <p>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="me-2 qa-icon-circle"
                  />
                  In modo completamente gratuito
                </p>
              </div>
            </div>
            <div className="col-12 col-lg-5 order-1 order-lg-2 qa-header-img">
              <img src={img_chat} alt="Immagine chat" />
            </div>
          </div>

          <TextareaDomanda
            data={domanda}
            setData={setDomanda}
            handleBtn={handleInvioDomanda}
          />

          <div className="row">
            <div className="col-md-4 qa-number">
              <div className="qa-number-icon">
                <FontAwesomeIcon icon={faCommentDots} />
              </div>
              <div className="qa-number-text">
                <h3>{num_request}</h3>
                <p>domande poste dai pazienti</p>
              </div>
            </div>
            <div className="col-md-4 qa-number">
              <div className="qa-number-icon">
                <FontAwesomeIcon icon={faCommentAlt} />
              </div>
              <div className="qa-number-text">
                <h3>{num_answer}</h3>
                <p>risposte date dai dottori</p>
              </div>
            </div>
            <div className="col-md-4 qa-number">
              <div className="qa-number-icon">
                <FontAwesomeIcon icon={faUserDoctor} />
              </div>
              <div className="qa-number-text">
                <h3>{num_doctor}</h3>
                <p>specialisti disponibili</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-3">
        <div className="qa-how-work">
          <h3>Come funziona?</h3>
          <hr />
          <div className="row mt-3">
            <div className="col-md-3 qa-how-work-container">
              <div className="work-circle">
                <p>1</p>
              </div>
              <div className="work-text">
                <h6>Poni una domanda</h6>
                <p>Poni una breve domanda su tuo problema di salute.</p>
              </div>
            </div>
            <div className="col-md-3 qa-how-work-container">
              <div className="work-circle">
                <p>2</p>
              </div>
              <div className="work-text">
                <h6>La domanda è inoltrata ai dottori</h6>
                <p>
                  Le domande vengono verificate attraverso un sistema di
                  moderazione e inoltrate ai relativi specialisti che sono
                  disposti a rispondere.
                </p>
              </div>
            </div>
            <div className="col-md-3 qa-how-work-container">
              <div className="work-circle">
                <p>1</p>
              </div>
              <div className="work-text">
                <h6>Il dottore ti risponde</h6>
                <p>
                  Di solito la domanda riceve risposte da più di un medico o
                  specialista..
                </p>
              </div>
            </div>
            <div className="col-md-3 qa-how-work-container">
              <div className="work-circle">
                <p>1</p>
              </div>
              <div className="work-text">
                <h6>Leggi la risposta</h6>
                <p>Ti avviseremo via email in caso di nuove risposte.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-3">
        <QuestionLast30Days />
      </div>

      <div className="container">
        <p className="text-grey">
          Tutti i contenuti pubblicati su MedHUB, specialmente domande e
          risposte, sono di carattere informativo e in nessun caso devono essere
          considerati un sostituto di una visita specialistica.
        </p>
      </div>

      <Footer />
    </div>
  );
}
