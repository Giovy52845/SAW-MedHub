// Import componenti React e di terze parti
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// Import file locali
import logo from "../../assets/img/logo_green.png";
import gdpr from "../../assets/img/GDPR-rafiki.png";
import owner from "../../assets/img/privacy-owner.png";

// File CSS
import "./PatientData.css";

export default function PatientData() {
  const navigate = useNavigate();
  return (
    <>
      <section className="hero-privacy patient-navbar">
        <div className="container navbar-patientdata">
          <div className="navbar-patientdata-btn">
            <button onClick={() => navigate(-1)}>&larr; Indietro</button>
          </div>
          <div className="navbar-patientdata-logo">
            <img src={logo} />
          </div>
        </div>
      </section>

      <section className="privacy-wrapper">
        <div className="container privacy-container">
          <div className="row">
            <div className="col-md-4 order-1 order-md-2 text-center privacy-img">
              <img src={gdpr} alt="Immagine GDPR" className="img-fluid" />
            </div>
            <div className="col-md-8 order-2 order-md-1 privacy-text">
              <h3>Tutti i dati che trovi su MedHUB sono protetti e sicuri</h3>
              <div className="privacy-li-text">
                <p>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="me-2 icon-circle"
                  />{" "}
                  Che tu sia un dottore o un paziente, tutti i dati che
                  inserisci sono esclusivamente tuoi.{" "}
                </p>
              </div>
              <div className="privacy-li-text">
                <p>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="me-2 icon-circle"
                  />{" "}
                  Tutte le informazioni che ti appartengono sono criptate e
                  protette{" "}
                </p>
              </div>
              <div className="privacy-li-text">
                <p>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="me-2 icon-circle"
                  />{" "}
                  MioDottore non condividerà né venderà i tuoi dati{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="owner-wrapper">
        <div className="container owner-container">
          <div className="row">
            <div className="col-md-6 owner-img">
              <img src={owner} alt="Immagine GDPR" className="img-fluid" />
            </div>
            <div class="col-md-6 d-flex flex-column justify-content-center owner-text">
              <h3 class="mb-2">L'unico proprietario dei tuoi dati sei tu</h3>
              <p class="text-secondary mb-3">
                Nessuno potrà avere accesso ai dati che dottori o pazienti ci
                lasciano.
              </p>
              <p class="mb-2">
                Tutti i dati inseriti in MioDottore sono esclusivi di chi li
                inserisce.
              </p>
              <p class="mb-2">I dati sono tuoi e sono ben protetti.</p>
              <p class="text-secondary mb-0">
                Non condivideremo né venderemo mai a terzi i tuoi dati.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="data-footer ">
        <div className="container">
          <h2 className="text-white">
            Hai qualche dubbio sul trattamento dei dati o hai bisogno di aiuto
            per gestirli?
          </h2>
          <p className="mb-2 text-white">
            Scrivici a supporto@miodottore.it. Saremo felici di aiutarti.
          </p>
        </div>
      </footer>
    </>
  );
}
