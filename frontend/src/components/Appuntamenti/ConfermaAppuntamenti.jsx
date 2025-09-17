import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock,
         faUser,
         faEnvelope,
         faComments,
         faLocationDot,
         faCheck,
         faTrash } from '@fortawesome/free-solid-svg-icons';
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

import { putAppuntamentiConferma,
         putAppuntamentiCancella,
         registraPazienteAppuntamento} from "../../api/api"

import { postInvioNotifica } from "../../api/notifiche";
import "./Appuntamenti.css"

export default function ConfermaAppuntamenti( {uid} ) {

    const [appuntamenti, setAppuntamenti] = useState([]);

    const appuntamentiFuturi = appuntamenti.filter(app => {
        const inizio = new Date(app.timestamp.seconds * 1000);
        return inizio >= new Date() && app.stato === "attesa";
    }).sort((a, b) => {
        const dataA = new Date(a.timestamp.seconds * 1000);
        const dataB = new Date(b.timestamp.seconds * 1000);
        return dataA - dataB;
    })

    const firstLoadRef = useRef(true);

    useEffect(() => {
        if (!uid) return;

        const q = query(
            collection(db, "appuntamenti"),
            where("idSan", "==", uid)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tutti = [];
            querySnapshot.forEach((doc) => {
                tutti.push({ id: doc.id, ...doc.data() });
            });
            setAppuntamenti(tutti);

            // Salta il primo snapshot iniziale
            if (firstLoadRef.current) {
                firstLoadRef.current = false;
                return;
            }

            // Solo aggiunte
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const nuovoApp = change.doc.data();
                    toast.info(`Nuovo appuntamento da ${nuovoApp.nomePaziente || 'un paziente'}`);
                }
            });
        });

        return () => unsubscribe();
    }, [uid]);

    async function handleConfermaAppuntamento(idAppuntamento) {
        try {
            const res = await putAppuntamentiConferma(idAppuntamento);
            toast.success("Appuntamento confermato!");
            
            // Dopo che ho confermato l'appuntamento registro il paziente come assistito
            registraPazienteAppuntamento(idAppuntamento);

            // Recupero l'appuntamento
            const appuntamento = appuntamentiFuturi.find(x => x.idAppuntamento === idAppuntamento);
            const message = {
                userId: appuntamento.idPaz,
                role: 'paziente',
                title: "Appuntamento confermato",
                body: `Il tuo appuntamento per il giorno ${appuntamento.data} è stato confermato`,
                url: '/tuo-account/lista-visite',
                type: 'appointment',
                actions: JSON.stringify([
                    { action: 'open', title: 'Apri' },
                    { action: 'dismiss', title: 'Chiudi' }
                ])
            }
            
            // Invio la notifica
            const invioNot = await postInvioNotifica(message);

        } catch(err){
            console.error("Si è verificato un errore: ", err);
            toast.error("Si è verificato un errore durante la conferma dell'appuntamento.");
        }

    }

    async function handleCancellaAppuntamento(idAppuntamento) {
        try {
            const res = putAppuntamentiCancella(idAppuntamento);
            toast.success("Appuntamento cancellato!");
            
            // Recupero l'appuntamento
            const appuntamento = appuntamentiFuturi.find(x => x.idAppuntamento === idAppuntamento);
            const message = {
                userId: appuntamento.idPaz,
                role: 'paziente',
                title: "Appuntamento cancellato",
                body: `Il tuo appuntamento per il giorno ${appuntamento.data} è stato cancellato`,
                url: '/tuo-account/lista-visite',
                type: 'appointment',
                actions: JSON.stringify([
                    { action: 'open', title: 'Apri' },
                    { action: 'dismiss', title: 'Chiudi' }
                ])
            }
            
            // Invio la notifica
            const invioNot = await postInvioNotifica(message);
        } catch(err){
            console.error("Si è verificato un errore: ", err);
            toast.error("Si è verificato un errore durante la cancellazione dell'appuntamento.");
        }
    }

    return(
        <div className="conferma-appuntamenti__wrapper">
            <div className="conferma-appuntamenti__header">
                <h4>Conferma appuntamenti</h4>
            </div>
            <div className="conferma-appuntamenti__body">
                {appuntamentiFuturi.length === 0 ? (
                    <div className="no-appuntamenti-loader">
                        <div className="spinner" />
                        <p>In attesa di nuovi appuntamenti...</p>
                    </div>
                 ) : (
                    appuntamentiFuturi.map((app, index) => (
                        <div key={index} className="conferma-appuntamenti__card">
                            <div className="conferma-appuntamenti__data">
                                <FontAwesomeIcon icon={faClock} style={{color: "#4A90E2" }}/>
                                <p>{app.hInizio} -  
                                    {new Date(app.data).toLocaleDateString("it-IT", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>
                            <div className="conferma-appuntamenti__info">
                                <div className="info-row">
                                    <FontAwesomeIcon icon={faUser} style={{ color: '#333' }} />
                                    <p>{app?.nomeCognomePAZ || "Nome e Cognome non disponibili"}</p>
                                </div>

                                <div className="info-row">
                                        <FontAwesomeIcon icon={faEnvelope} style={{ color: '#D35400' }} />
                                        <p>{app?.email}</p>
                                </div>

                                <div className="info-row">
                                    <FontAwesomeIcon icon={faComments} style={{ color: '#50C878' }} />
                                    <p>{app?.prestazione || "Prestazione non inserita"}</p>
                                </div>

                                <div className="info-row">
                                    <FontAwesomeIcon icon={faLocationDot} style={{ color: '#9B59B6' }} />
                                    <p>{app.tipo === "studio" ? "Visita in studio" : "Visita online"}</p>
                                </div>
                            </div>
                            <div className="conferma-appuntamenti__btn">
                                <button
                                    className="conferma-appuntamenti__conferma"
                                    onClick={() => handleConfermaAppuntamento(app?.idAppuntamento)}
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                    Conferma
                                </button>
                                <button
                                    className="conferma-appuntamenti__cancella"
                                    onClick={() => handleCancellaAppuntamento(app?.idAppuntamento)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                    Cancella
                                </button>
                                </div>
                                    <div className="conferma-appuntamenti__footer">
                            </div>
                        </div>
                    ))
                 )}
            </div>
        </div>
    );
}