import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import NavbarAccount from "../../components/Navbar/NavbarAccount";
import PazienteSettingsSidebar from "../../components/PazienteSettingsSidebar/PazienteSettingsSidebar";

import { getPaziente, getPreferitiPaziente } from "../../api/api";

import "./SanitariPreferiti.css";

export default function SanitariPreferiti() {
  const { userData, loading } = useAuth();
  const location = useLocation();

  const [profiloUtente, setProfiloUtente] = useState(null);
  const [preferiti, setPreferiti] = useState([]);

  useEffect(() => {
    let isMounted = true;

    getPaziente(userData?.uid)
      .then((data) => {
        if (isMounted) setProfiloUtente(data);
      })
      .catch((err) => console.error("Si è verificato un errore.", err));

    return () => {
      isMounted = false;
    };
  }, [userData?.uid]);

  useEffect(() => {
    let isMounted = true;

    if (!profiloUtente?.uid) return;

    getPreferitiPaziente(profiloUtente?.uid)
      .then((data) => {
        if (isMounted) setPreferiti(data);
      })
      .catch((err) => console.error("Errore nel recupero dei preferiti:", err));

    return () => {
      isMounted = false;
    };
  }, [profiloUtente?.uid]);

  if (loading || !userData || userData?.ruolo !== "paziente") {
    return <p>Caricamento preferiti...</p>;
  }

  return (
    <div className="container-fluid preferiti">
      <div className="container preferiti__wrapper">
        <NavbarAccount email={profiloUtente?.email} />
        <div className="row">
          <PazienteSettingsSidebar />

          <div
            className="col-lg-9 preferiti__container"
            key={location.pathname}
          >
            <h3>I tuoi preferiti</h3>
            <div className="row">
              <div className="preferiti-grid">
                {preferiti.map((doc) => (
                  <div key={doc.id} className="preferiti__card">
                    <div className="preferiti__img">
                      <Link to={`/sanitario/${doc.slug}`}>
                        <img
                          src={doc.imgURL}
                          alt={`Immagine di profilo ${doc.slug}`}
                        />
                      </Link>
                    </div>
                    <div className="preferiti__title">
                      <Link to={`/sanitario/${doc.slug}`}>
                        <h6>
                          {doc.nome.toUpperCase()} {doc.cognome.toUpperCase()}
                        </h6>
                      </Link>
                      <h6>{doc.specializzazione}</h6>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
