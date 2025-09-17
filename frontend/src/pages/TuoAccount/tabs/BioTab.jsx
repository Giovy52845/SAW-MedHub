// ! Import REACT e di terze parti
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify"

// ! Import API
import { putSanitarioBio, getSanitarioData } from "../../../api/api";

import "./tabs.css";

export default function BioTab( {specializzazione, uid} ) {

    // ? Variabili utilizzate per salvare i dati ricavati dagli input
    const [compSpecifiche, setCompSpecifiche] = useState('');
    const [formazione, setFormazione] = useState('');
    const [anniEsperienza, setAnniEsperienza] = useState('');
    const [bio, setBio] = useState('');

    const [userData, setUserData] = useState(null);

    // ? Aggiorna gli input ogni volta che cambia userData
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
    }, [uid])
    useEffect(() => {
        if(userData){
            setCompSpecifiche(userData.comp_specifiche || "");
            setFormazione(userData.formazione || "");
            setAnniEsperienza(userData.anni_esperienza || "");
            setBio(userData.bio || "");
        }
        
    }, [userData]);    

    // ? Funzione per resettare gli input
    function handleAnnullaBioSpec() {
        setCompSpecifiche('');
        setFormazione('');
        setAnniEsperienza('');
        setBio('');

        putSanitarioBio(uid)
            .then((data) => {
                setUserData(data)
            })
            .catch((err) => {
                console.error("Si è verificato un errore nell'aggiornamento dei dati.", err);
            })
    }

    async function handleSaveBioSpec() {
        // ? Chiamo l'API e salvo il contenuto
        try{
            const res = await putSanitarioBio(uid, compSpecifiche, formazione, anniEsperienza, bio);
            if (!res.success) throw new Error(res.messaggio || "Errore generico");
            toast.success("Dati aggiornati con successo.");
        } catch (err) {
            console.error("Errore aggiornamento della bio:", err);
            toast.error("Si è verificato un errore nel salvataggio dei dati.");
        }       
    }

    return (
        <div className="tab-pane fade show active">
            <div className="sanitario-card__input row">
                <div className="col-lg-3 sanitario-card__label">
                    <h5>Specializzazione</h5>
                </div>
                <div className="col-lg-9 sanitario-card__field">
                    <input
                        type="text"
                        placeholder={specializzazione.toUpperCase()}
                        readOnly
                    />
                </div>
            </div>
        <div className="sanitario-card__input row">
            <div className="col-lg-3 sanitario-card__label">
                <h5>Competenze specifiche</h5>
            </div>
            <div className="col-lg-9 sanitario-card__field">
                <input
                    type="text"
                    onChange={(e) => setCompSpecifiche(e.target.value)}
                    value={compSpecifiche}
                />
            </div>
        </div>
        <div className="sanitario-card__input row">
            <div className="col-lg-3 sanitario-card__label">
                <h5>Formazione</h5>
            </div>
            <div className="col-lg-9 sanitario-card__field">
                <input
                    type="text"
                    onChange={(e) => setFormazione(e.target.value)}
                    value={formazione}
                />
            </div>
        </div>
        <div className="sanitario-card__input row">
            <div className="col-lg-3 sanitario-card__label">
                <h5>Anni di esperienza</h5>
            </div>
            <div className="col-lg-9 sanitario-card__field">
                <input
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) => setAnniEsperienza(e.target.value)}
                    value={anniEsperienza}
                />
            </div>
        </div>
        <div className="sanitario-card__input row">
            <div className="col-lg-3 sanitario-card__label">
                <h5>Bio</h5>
            </div>
            <div className="col-lg-9 sanitario-card__field">
                <textarea onChange={(e) => setBio(e.target.value)} value={bio} />
            </div>
        </div>
        <div className="row bio-spec__btn">
            <div className="col-md-2">
                <button
                    className="spec__btn-save"
                    onClick={() => handleSaveBioSpec()}
                >
                    <FontAwesomeIcon icon={faSave} />
                    Salva
                </button>
            </div>
            <div className="col-md-2">
                <button
                    className="spec__btn-cancel"
                    onClick={() => handleAnnullaBioSpec()}
                >
                    <FontAwesomeIcon icon={faDeleteLeft} />
                    Annulla
                </button>
            </div>
        </div>
    </div>
    );
}
