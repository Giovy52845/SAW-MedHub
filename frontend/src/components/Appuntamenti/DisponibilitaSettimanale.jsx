import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { putFasceDisponibilita, getFasceDisponibilita } from "../../api/api";

import "./Appuntamenti.css"
import GiornoDisponibilita from "./GiornoDisponibilita";


const giorniSettimana = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];


export default function DisponibilitaSettimanale( {uid} ) {

    const [disponibilita, setDisponibilita] = useState({});

    useEffect(() => {
        const caricaDisponibilita = async () => {
            try {
                const data = await getFasceDisponibilita(uid);
                setDisponibilita(data);
            } catch (err) {
                console.error("Errore caricamento fasce:", err);
                alert("Errore durante il caricamento della disponibilità");
            }
        };

        caricaDisponibilita();
    }, [uid]);

    const aggiornaGiorno = (giorno, nuoveFasce) => {
        setDisponibilita(prev => ({
            ...prev,
            [giorno]: nuoveFasce
        }));
    }

    async function salvaFasce() {
        try {
            await putFasceDisponibilita(uid, disponibilita);
            toast.success("Fascia oraria salvata con successo.");
        } catch (err) {
            console.error("Errore nel salvataggio fasce:", err);
            toast.error("Si è verificato un errore nel salvataggio della fascia.");
        }
    }

    return (
        <>
            <div className="sanitario-appuntamenti__settimana">
                <div>
                    <h4>Disponibilità ricorrenti</h4>
                </div>
                <div className="sanitario-appuntamenti__giorni-wrapper">
                    {giorniSettimana.map(giorno => (
                        <GiornoDisponibilita
                            key={giorno}
                            giorno={giorno}
                            fasce={disponibilita[giorno] || []}
                            onChange={(nuoveFasce) => aggiornaGiorno(giorno, nuoveFasce)}
                        />
                    ))}
                </div>
                <div className="btn-save-container">
                    <button
                        className="salva-fascia-btn"
                        onClick={() => salvaFasce()}
                    >
                        Salva fasce
                    </button>
                </div>
            </div>
        </>
    );
}