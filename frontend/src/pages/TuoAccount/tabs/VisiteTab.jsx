import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave} from '@fortawesome/free-solid-svg-icons';

import { putSanitarioModVisita, getSanitarioData } from "../../../api/api";

import "./tabs.css";

export default function VisiteTab( {uid} ) {
    
    const [userData, setUserData] = useState(null);

    useEffect(() =>{
        if(uid){
            getSanitarioData(uid)
                .then((data) => {
                    setUserData(data);
                })
                .catch((err) => {
                    console.error("Si è verificato un errore nel recupero dei dati.", err);
                })
        }
    }, [uid]);

    const [modalitaVisita, setModalitaVisita] = useState({
        studio: false,
        indirizzo: "",
        citta: "",
        citta_normalized: "",
        online: false,
    });

    useEffect(() => {
        if(userData){
            setModalitaVisita(userData.modalita_visita || {
                studio: false,
                indirizzo: "",
                citta: "",
                citta_normalized: "",
                online: false,
            });
        }
    }, [userData]);    

    async function handleSaveModalitaVisita() {
        try {
            const res = await putSanitarioModVisita(uid, modalitaVisita);
            if (!res.success) throw new Error(res.messaggio || "Errore generico");
            toast.success("Dati aggiornati con successo.");
        } catch (err) {
            console.error("Errore aggiornamento modalità visita:", err);
            toast.error("Si è verificato un errore nel salvataggio dei dati.");
        }
    }

    
    return (
        <div className="tab-pane fade show active">
            <h5>Modalità di visita disponibili</h5>
            <div className="form-check mb-2 visite-checkbox">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="studio"
                    checked={modalitaVisita.studio}
                    onChange={(e) =>
                        setModalitaVisita({ ...modalitaVisita, studio: e.target.checked })
                    }
                />
                <label className="form-check-label" htmlFor="studio">
                    Presso studio
                </label>
            </div>
            {modalitaVisita.studio && (
                <div className="mb-3 modalita-visita">
                    <div className="modalita-visita-card">
                        <label className="form-label">Indirizzo Studio</label>
                        <input
                            type="text"
                            className="form-control"
                            value={modalitaVisita.indirizzo}
                            onChange={(e) =>
                                setModalitaVisita({
                                ...modalitaVisita,
                                indirizzo: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="modalita-visita-card">
                        <label className="form-label">Citta</label>
                        <input
                            type="text"
                            className="form-control"
                            value={modalitaVisita.citta}
                            onChange={(e) =>
                                setModalitaVisita({ ...modalitaVisita, citta: e.target.value, citta_normalized: e.target.value.toLowerCase() })
                            }
                            required
                        />
                    </div>
                </div>
            )}
            <div className="form-check mb-5">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="online"
                    checked={modalitaVisita.online}
                    onChange={(e) =>
                        setModalitaVisita({ ...modalitaVisita, online: e.target.checked })
                    }
                />
                <label className="form-check-label" htmlFor="online">
                    Videovisita Online
                </label>
            </div>
            <button
                className="spec__btn-save"
                onClick={handleSaveModalitaVisita}
            >
                <FontAwesomeIcon icon={faSave} /> Salva
            </button>
        </div>
    );
}
