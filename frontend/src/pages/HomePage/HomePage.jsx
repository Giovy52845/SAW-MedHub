// Librerie di React e strumenti di terze parti
import {
  faCalendar,
  faClock,
  faMessage,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Navigate } from "react-router-dom";

// Componenti locali
import { useAuth } from "../../AuthContext.jsx";

import MyNavbar from "../../components/Navbar/MyNavbar.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import BenefitCard from "../../components/BenefitCard/BenefitCard.jsx";
import QuestionsWidget from "../../components/QuestionWidget/QuestionsWidget.jsx";
import ReviewsWidget from "../../components/ReviewsWidget/ReviewsWidget.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import DoctorCarousel from "../../components/DoctorCarousel/DoctorCarousel.jsx";

import illustrazione from "../../../public/illustrazione.png";

import "./homepage.css";

export default function HomePage() {
  const { userData, loading } = useAuth();

  if (loading) return <p>Caricamento...</p>;

  // Se il ruolo è "sanitario", lo reinderizzo alla dashboard
  if (userData?.ruolo === "sanitario") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <MyNavbar />
      {/* Navigation */}
      <section className="hero d-flex">
        <div className="hero-content container">
          <div className="row align-items-center">
            <div className="col-lg-7 text-white mb-4 mb-lg-0">
              <h1 className="display-6 fw-bold">
                Prenota la tua visita online!
              </h1>
              <p className="lead">
                Cerca tra 200 000 Specialisti e Medici di Medicina Generale.
              </p>
            </div>
            <div className="col-lg-5 text-center">
              <img
                src={illustrazione}
                alt="Hero doctor illustration"
                className="img-fluid hero-img"
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>
      <section className="benefits">
        <div className="hero-content container">
          <div className="row">
            <BenefitCard
              icon={faSearch}
              title="Trova un dottore nella tua città"
              subtitle="Scegli tra oltre 200 000 medici di medicina generale e specialisti. Leggi le recensioni di altri pazienti."
            />
            <BenefitCard
              icon={faCalendar}
              title="Prenota una visita!"
              subtitle="Scegli la data che preferisci, inserisci i tuoi dati e conferma… la visita è prenotata!"
            />
            <BenefitCard
              icon={faMessage}
              title="Richiedi prescrizioni"
              subtitle="Richiedi prescrizioni e condividi i risultati di test ed analisi con il tuo medico di medicina generale."
            />
            <BenefitCard
              icon={faClock}
              title="Promemoria via mail e SMS"
              subtitle="Ti ricorderemo della tua visita tramite email e sms."
            />
          </div>
        </div>
      </section>
      <hr />

      <section className="questions-reviews">
        <div className="hero-content container">
          <div className="row">
            <QuestionsWidget />
            <ReviewsWidget />
          </div>
        </div>
      </section>

      <section className="new-profile">
        <div className="hero-content container">
          <div className="row">
            <DoctorCarousel />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
