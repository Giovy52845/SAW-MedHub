import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

import { useAuth } from "../../AuthContext";
import { getPaziente, getSanitarioData, postRecensione } from "../../api/api";

import logo from "../../assets/img/navbar_logo_green.png";

import "./CreaRecensione.css";
import { toast } from "react-toastify";

export default function CreaRecensione() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const { userData } = useAuth();
  const [sanitario, setSanitario] = useState(null);
  const [paziente, setPaziente] = useState(null);

  const [step, setStep] = useState(1);

  const [valRecensione, setValRecensione] = useState();
  const [recensione, setRecensione] = useState("");
  const [firma, setFirma] = useState("");
  const [prestazione, setPrestazione] = useState("");

  const totalSteps = 3;

  const ProgressBar = ({ step, totalSteps }) => {
    const percentage = (step / totalSteps) * 100;

    return (
      <div
        style={{
          height: "5px",
          width: "100%",
          backgroundColor: "#e0e0e0",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor: "#4BA276",
            transition: "width 0.3s ease-in-out",
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    if (!uid) return;
    getSanitarioData(uid)
      .then((data) => setSanitario(data))
      .catch((err) =>
        console.error("Impossibile recuperare i dati del sanitario: ", err)
      );
  }, [uid]);

  useEffect(() => {
    if (!userData?.uid) return;
    getPaziente(userData?.uid)
      .then((data) => setPaziente(data))
      .catch((err) => console.error("Si è verificato un errore: ", err));
  }, [userData?.uid]);

  function handleInvioRecensione() {
    const nuovaRecensione = {
      valRecensione,
      recensione,
      firma,
      prestazione,
    };

    try {
      postRecensione(sanitario?.uid, paziente?.uid, nuovaRecensione);
      setStep(3);
    } catch (err) {
      console.error("Si è verificato un errore: ", err);
      toast.error("Errore nella pubblicazione della recensione.");
      navigate("/");
    }
  }

  return (
    <div className="scrivi-recensione-container-fluid container-fluid">
      <div className="recensione-navbar">
        <div className="back">
          <button
            onClick={() => {
              step === 1
                ? navigate(-1)
                : setStep((prev) => Math.max(prev - 1, 1));
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
        <div className="recensione-log">
          <img src={logo} alt="Logo MEDHUB" onClick={() => navigate("/")}></img>
        </div>
        <div className="recensioni-step">
          <h6>
            {step}/{totalSteps}
          </h6>
        </div>
      </div>
      <ProgressBar step={step} totalSteps={totalSteps} />
      <div className="container">
        <div className="row">
          <div className="col-lg-4 crea-recensione__container">
            <div className="crea-recensione__header">
              <h3>Come è stata la tua esperienza con lo specialista?</h3>
              <div className="card crea-recensione-card">
                <div className="crea-recensione-img">
                  <img
                    src={sanitario?.fotoProfiloURL}
                    alt={`Immagine del profilo di ${sanitario?.nome} ${sanitario?.cognome}`}
                  />
                </div>
                <div className="crea-recensione-info">
                  <h6>
                    {sanitario?.nome.toUpperCase()}{" "}
                    {sanitario?.cognome.toUpperCase()}
                  </h6>
                  <p>{sanitario?.specializzazione}</p>
                </div>
              </div>
            </div>
            {step === 1 && (
              <StarRating
                onChange={(val) => {
                  setValRecensione(val);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && (
              <ScriviRecensione
                recensione={recensione}
                setRecensione={setRecensione}
                firma={firma}
                setFirma={setFirma}
                prestazione={prestazione}
                setPrestazione={setPrestazione}
                paziente={paziente}
                sanitario={sanitario}
                onInvio={handleInvioRecensione}
              />
            )}
            {step === 3 && (
              <div className="invio-confermato">
                <h4>✅ Grazie per la tua recensione!</h4>
                <p>
                  Il tuo contributo è prezioso per aiutare altri utenti a
                  scegliere con fiducia.
                </p>
                <button
                  onClick={() => navigate(`/sanitario/${sanitario?.slug}`)}
                >
                  Torna al profilo del sanitario
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function StarRating({ onChange }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);

    return (
      <div>
        <h6>Punteggio generale</h6>
        <div className="punteggio-star">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => {
                setRating(star);
                onChange?.(star);
              }}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer", color: "#4BA276" }}
            >
              <FontAwesomeIcon
                icon={star <= (hover || rating) ? solidStar : regularStar}
              />
            </span>
          ))}
        </div>
        <p className="text-muted mt-2">
          Da 1 a 5, come valuteresti la tua esperienza con lo specialista?
        </p>
      </div>
    );
  }
}

function ScriviRecensione({
  recensione,
  setRecensione,
  firma,
  setFirma,
  prestazione,
  setPrestazione,
  paziente,
  sanitario,
  onInvio,
}) {
  setFirma(paziente?.firma);

  return (
    <div className="scrivi-recensione__container">
      <div className="scrivi-recensione__textarea">
        <h5>✏️ Scrivi la recensione</h5>
        <p className="scrivi-recensione-p">
          Cerca di aggiungere dettagli alla tua recensione per renderla quanto
          più specifica possibile.
        </p>
        <textarea
          className="recensione-input"
          onChange={(e) => setRecensione(e.target.value)}
          value={recensione}
        />
      </div>
      <div className="scrivi-recensione__nome">
        <h5>👤 Il tuo nome</h5>
        <p className="scrivi-recensione-p">Comparirà accanto alla recensione</p>
        <input
          className="recensione-input"
          placeholder={firma}
          onChange={(e) => setFirma(e.target.value)}
        />
      </div>
      <div className="scrivi-recensione__visita">
        <h5>🩺 Motivo della visita?</h5>
        <select
          onChange={(e) => setPrestazione(e.target.value)}
          className="recensione-input"
        >
          <option>Che prestazione è stata effettuata?</option>
          {sanitario?.prestazioni.map((data, index) => (
            <option key={index} value={data.nome}>
              {data.nome}
            </option>
          ))}
        </select>
      </div>
      <div className="invia-recensione">
        <button onClick={() => onInvio()}>Invia la recensione</button>
      </div>
    </div>
  );
}
