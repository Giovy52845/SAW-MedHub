// ! Import REACT e di terze parti
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

// ! Import API
import { putSanitarioTariffe, getSanitarioData } from "../../../api/api";

import "./tabs.css";

export default function TariffeTab({ uid }) {
  const [userData, setUserData] = useState(null);
  const [prestazioni, setPrestazioni] = useState([{ nome: "", prezzo: "" }]);

  useEffect(() => {
    if (uid) {
      getSanitarioData(uid)
        .then((data) => {
          setUserData(data);
        })
        .catch((err) => {
          console.error(
            "Si è verificato un errore nel recupero dei dati.",
            err
          );
        });
    }
  }, [uid]);

  useEffect(() => {
    if (userData && Array.isArray(userData.prestazioni)) {
      setPrestazioni(userData.prestazioni);
    } else if (userData) {
      setPrestazioni([{ nome: "", prezzo: "" }]);
    }
  }, [userData]);

  function aggiungiPrestazione() {
    setPrestazioni([...prestazioni, { nome: "", prezzo: "" }]);
  }

  function aggiornaPrestazione(index, campo, valore) {
    const nuove = [...prestazioni];
    nuove[index][campo] = valore;
    setPrestazioni(nuove);
  }

  function rimuoviPrestazione(index) {
    const nuove = prestazioni.filter((_, i) => i !== index);
    setPrestazioni(nuove);
  }

  async function handleSaveTariffe() {
    try {
      const res = await putSanitarioTariffe(uid, prestazioni);
      if (!res.success) throw new Error(res.messaggio || "Errore generico");
      toast.success("Dati aggiornati con successo.");
    } catch (err) {
      console.error("Errore: ", error);
      toast.error("Si è verificato un errore nel salvataggio delle tariffe.");
    }
  }

  return (
    <div className="tab-pane fade show active">
      {prestazioni.map((item, index) => (
        <div className="sanitario-card__input row" key={index}>
          <div className="col-md-4 sanitario-card__tariffa">
            <input
              type="text"
              placeholder="Nome prestazione"
              value={item.nome}
              onChange={(e) =>
                aggiornaPrestazione(index, "nome", e.target.value)
              }
            />
          </div>
          <div className="col-md-4 sanitario-card__tariffa">
            <input
              type="number"
              placeholder="Prezzo €"
              value={item.prezzo}
              onChange={(e) =>
                aggiornaPrestazione(index, "prezzo", e.target.value)
              }
            />
          </div>
          <div className="col-lg-4 sanitario-card__btn">
            <button className="add-btn" onClick={aggiungiPrestazione}>
              <FontAwesomeIcon icon={faPlus} />
              Aggiungi Prestazione
            </button>
            <button
              className="remove-btn"
              onClick={() => rimuoviPrestazione(index)}
            >
              <FontAwesomeIcon icon={faTrash} />
              Rimuovi
            </button>
          </div>
        </div>
      ))}
      <div className="tariffe-btn-add">
        <button className="spec__btn-save" onClick={handleSaveTariffe}>
          Salva
        </button>
      </div>
    </div>
  );
}
