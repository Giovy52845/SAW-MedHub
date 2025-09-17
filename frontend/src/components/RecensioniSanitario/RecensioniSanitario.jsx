
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getRecensioniSanitario, getSanitarioData } from '../../api/api'
import { StarRating } from "../ReviewsWidget/ReviewsWidget";
import "./RecensioniSanitario.css"
import { useAuth } from "../../AuthContext";

export default function RecensioniSanitario( {uid} ) {

    const { userData } = useAuth();
    const navigate = useNavigate();

    const [sanitario, setSanitario] = useState(null);
    const [recensioni, setRecensioni] = useState([]);

    useEffect(() => {
        getSanitarioData(uid)
            .then((data) => setSanitario(data))
            .catch((err) => console.error("Si è verificato un errore: ", err));
    }, [uid]);

    useEffect(() => {
        if(!sanitario?.uid) return;

        getRecensioniSanitario(sanitario?.uid)
            .then((data) => setRecensioni(data))
            .catch((err) => console.error("Si è verificato un errore: ", err));
    }, [sanitario?.uid])
    
    function handleRecensione() {
        if(!userData?.uid) {
            toast.warning("Per effettuare una recensione devi effettuare il login.");
        } else {
            navigate(`/sanitario/scrivi-recensione/${sanitario?.uid}`);
        }
    }

    return (
        <div className="recensioni-container">
            <div className="recensioni-header">
                <h5>Recensioni</h5>
                <button
                    className="recensione-btn"
                    onClick={() => handleRecensione()}
                >
                    Aggiungi una recensione
                </button>
            </div>
            <div className="recensione-star">
                <StarRating rating={sanitario?.valutazioneMedia} />
                <p><strong>{sanitario?.recensioniCount}</strong> {sanitario?.recensioniCount === 1 ? "recensione" : "recensioni"}</p>
            </div>
            {recensioni.length === 0 ? (
                <p>Non ci sono ancora recensioni per questo professionista.</p>
             ):(recensioni.map((data, index) => (
                <div key={index} className="recensione-item">
                    <div className="recensione-item-header">
                        <div className="recensione-firma-img">
                            <div className="recensione-circle">
                                <p>{data.firma[0]}</p>
                            </div>
                            <div className="recensione-firma">
                                <p>{data.firma}</p>
                            </div>
                            {data.verifica ? (
                                <div className="verifica-box verificato" 
                                    role="tooltip"
                                    title="✅ Recensione verificata: è presente almeno un appuntamento refertato registrato nel sistema tra questo paziente e il professionista." 
                                >
                                    <p>RECENSIONE VERIFICATA</p>
                                </div>
                            ) : (
                                <div className="verifica-box non_verificato"
                                    role="tooltip"
                                    title="⚠️ Questa recensione non è stata verificata: al momento non risultano appuntamenti refertati registrati nel sistema tra questo paziente e il professionista."
                                >
                                    <p>RECENSIONE NON VERIFICATA</p>
                                </div>
                            )}
                        </div>
                        <div className="recensione-star-item">
                            <StarRating rating={data.valRecensione} />
                        </div>
                    </div>
                    <div className="recensione-item-body">
                        <p className="rec-text">
                            {data.recensione}
                        </p>
                    </div>
                    <div className="recensione-item-footer">
                        {data?.prestazione && <p>{data.prestazione}</p>}
                    </div>
                    <hr />
                </div>
            )))}
        </div>
    );
}