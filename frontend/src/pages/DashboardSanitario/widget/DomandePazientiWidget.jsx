import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getListaDomande } from "../../../api/api";
import "./widget.css";

export default function DomandePazientiWidget({ uid }) {
  const [listaDomande, setListaDomande] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = getListaDomande((data) => {
      setListaDomande(Array.isArray(data) ? data : []);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [uid]);

  return (
    <div className="sanitario-widget__box">
      {listaDomande.length === 0 ? (
        <h3>Al momento non hai domande in attesa.</h3>
      ) : (
        <>
          <h3>Domande in attesa: {listaDomande.length}</h3>
          {listaDomande
            .sort((a, b) => new Date(b.dataDomanda) - new Date(a.dataDomanda))
            .slice(0, 5)
            .map((item) => (
              <p className="truncate-widget">- {item.testoDomanda}</p>
            ))}
          <div className="btn-domande">
            <button
              onClick={() => navigate("/lista-domande")}
              className="domande-widget-btn"
            >
              Vedi tutti
            </button>
          </div>
        </>
      )}
    </div>
  );
}
