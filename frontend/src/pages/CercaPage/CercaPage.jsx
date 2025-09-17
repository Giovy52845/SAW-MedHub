import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MyNavbar from "../../components/Navbar/MyNavbar";
import { getRicerca } from "../../api/ricerca";

import "./CercaPage.css";
import { StarRating } from "../../components/ReviewsWidget/ReviewsWidget";
import MappaIndirizzo from "../../components/MappaIndirizzo/MappaIndirizzo";
import Footer from "../../components/Footer/Footer"

export default function CercaPage() {
  // Recupero i paramentri
  const [searchParams] = useSearchParams();

  const mod = searchParams.get("modalita");
  const q = searchParams.get("q");
  const loc = searchParams.get("loc");

  const [listaSanitari, setListaSanitari] = useState([]);

  const navigate = useNavigate();

  let spec = q ? capitalize(q) : "Specialisti";
  let title;
  if (mod === "online") {
    title = `${spec} online`;
  } else {
    title = `${spec}${loc ? `, ${capitalize(loc)}` : ""}`;
  }

  useEffect(() => {
    const query = {
      spec: q,
      citta: loc,
      modalita: mod,
    };
    console.log(query);
    getRicerca(query)
      .then((data) => setListaSanitari(data))
      .catch((err) => console.error("errore: ", err));
  }, [mod, q, loc]);

  function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
  }

  return (
    <>
      <div className="container-fluid ricerca-fluid">
        <MyNavbar />
        <div className="container container-ricerca">
          <h3>{title}</h3>
          {listaSanitari.length === 0 ? (
            <p>Al momento non ci sono sanitari.</p>
          ) : (
            listaSanitari.map((doc, index) => (
              <div key={index} className="card card-ricerca-san">
                <div className="info-ricerca">
                  <div className="info-container">
                    <div className="img-san">
                      <img
                        src={doc.fotoProfiloURL}
                        onClick={() => navigate(`/sanitario/${doc.slug}`)}
                      />
                    </div>
                    <div className="info-san">
                      <Link to={`/sanitario/${doc.slug}`} className="title-san">
                        {capitalize(doc.nome)} {capitalize(doc.cognome)}
                      </Link>
                      <p className="subtitle-san">
                        {capitalize(doc.specializzazione)}
                      </p>
                      <div className="recensioni-ricerca">
                        <StarRating rating={doc.valutazioneMedia} />
                        <p>
                          {doc.recensioniCount}{" "}
                          {doc.recensioniCount === 1
                            ? "recensione"
                            : "recensioni"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="comp-specifiche">
                    <h4>Competenze Specifiche</h4>
                    <p>{doc.comp_specifiche}</p>
                  </div>
                  <div className="prestazioni">
                    <h4>Elenco prestazioni</h4>
                    {mod === "online" ? (
                      <p className="prestazione-online">💻 Consulenza online</p>
                    ) : doc.prestazioni.length === 0 ? (
                      <p className="no-prestazioni">
                        Al momento non sono state inserite le prestazioni
                        effettuate.
                      </p>
                    ) : (
                      doc.prestazioni.map((prest, index) => (
                        <div key={index} className="prestazioni-item">
                          <p>🩺 {prest.nome}</p>
                          <p>{prest.prezzo} €</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="ricerca-map">
                  <MappaIndirizzo
                    indirizzo={`${doc.modalita_visita.indirizzo}, ${doc.modalita_visita.citta}`}
                    height={400}
                    width={400}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
