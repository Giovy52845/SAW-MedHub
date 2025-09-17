import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from  "../firebase/firebase.js";


const BASE_URL = "http://localhost:3000/api";

// ! API PER SPECIALISTICHE

/**
 * Recupera la lista delle specialistiche
*/
export async function getSpecialistiche() {
    const res = await fetch(`${BASE_URL}/specialistiche`);

    if(!res.ok) throw new Error("Errore nella richiesta delle specialistiche");

    return res.json();
}

// ! API PER PAZIENTI

/**
 * Recupera i dati di un paziente
*/
export async function getPaziente(uid) {
    const res = await fetch(`${BASE_URL}/pazienti/${uid}`);
    
    if(!res.ok) throw new Error("Errore nella richiesta dei dati del paziente");
    
    return res.json();
}

/**
 * Aggiorna i dati di un paziente
*/
export async function putDatiPaziente(uid, data) {
    const res = await fetch(`${BASE_URL}/pazienti/${uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    
    if(!res.ok) throw new Error("Errore nell'aggiornamento dei preferiti");

    return res.json();
}

/**
 * Cancella i dati di un paziente
*/
export async function deletePaziente(uid) {
    const res = await fetch(`${BASE_URL}/pazienti/${uid}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if(!res.ok) throw new Error("Errore nella cancellazione dell'account.");

    return res.json();
}

/**
 * Aggiunge un sanitario alla lista dei preferiti
*/
export async function putSanitarioPreferiti(uidPaz, preferito) {
    const res = await fetch(`${BASE_URL}/pazienti/${uidPaz}/preferiti/${preferito.uid}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(preferito)
    })
    if(!res.ok) throw new Error("Errore nell'inserimento del sanitario nei preferiti.");

    return res.json();
}

/**
 * Rimuove un sanitario dalla lista dei preferiti
*/
export async function deleteSanitarioPreferiti(uidPaz, uidSan) {
    const res = await fetch(`${BASE_URL}/pazienti/${uidPaz}/preferiti/${uidSan}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });

    if(!res.ok) {
        throw new Error("Errore nella rimozione del preferito");
    }
    return await res.json();
}

/**
 * Recupera tutta la lista dei preferiti di un paziente 
*/
export async function getPreferitiPaziente(uid) {
    const res = await fetch(`${BASE_URL}/pazienti/${uid}/preferiti`)

    if(!res.ok) {
        throw new Error("Errore nel recupero dei preferiti");
    }
    return await res.json();
}

/**
 * Controlla se un sanitario è nella lista dei preferiti 
*/
export async function checkPreferitoSalvato(uid, uidSan) {
    const res = await fetch(`${BASE_URL}/pazienti/${uid}/preferiti/${uidSan}`)

    if(res.status === 404) {
        return false;
    }

    if(!res.ok) throw new Error("Errore nel recupero del sanitario.");

    return true;
}

// ! API PER SANITARI

/**
 * Recupera i dati di un sanitario
*/
export async function getSanitarioData(uid) {
    const res = await fetch(`${BASE_URL}/sanitari/${uid}`);
    
    if(!res.ok) throw new Error("Errore nella richiesta dei dati del sanitario.");

    return res.json();
}

/**
 * Modifica le info di base di un sanitario
*/
export async function putSanitarioBio(uid, comp_specifiche, formazione, anni_esperienza, bio) {
    const res = await fetch(`${BASE_URL}/sanitari/${uid}/bio`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            comp_specifiche,
            formazione,
            anni_esperienza,
            bio
        }),
    });

    if(!res.ok) throw new Error("Errore nell'aggiornamento del profilo.");

    return res.json();
}

/**
 * Aggiunge le prestazioni eseguite dal sanitario
*/
export async function putSanitarioTariffe(uid, prestazioni) {
    const res = await fetch(`${BASE_URL}/sanitari/${uid}/tariffe`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({ prestazioni }),
    });

    if(!res.ok) throw new Error("Errore nell'aggiornamento del profilo.");

    return res.json();
}

/**
 * Imposta la modalità di visita
*/
export async function putSanitarioModVisita(uid, modalita_visita) {
    const res = await fetch(`${BASE_URL}/sanitari/${uid}/modalita-visite`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({ modalita_visita }),
    });

    if(!res.ok) throw new Error("Errore nell'aggiornamento del profilo.");

    return res.json();
}

/**
 * Modifica la foto profilo
*/
export async function putSanitarioProfilePicture(uid, fotoProfiloURL) {
    const res = await fetch(`${BASE_URL}/sanitari/${uid}/foto-profilo`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({ fotoProfiloURL }),
    });

    if(!res.ok) throw new Error("Errore nell'aggiornamento del profilo.");

    return res.json();   
}

/**
 * Indica le fasce orarie in cui è disponibile un sanitario
*/
export async function putFasceDisponibilita(uid, disponibilita) {
    const res = await fetch(`${BASE_URL}/sanitari/${uid}/fasce_disponibilita`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify( {disponibilita} )
    });

    if(!res.ok) throw new Error("Errore nel salvataggio delle fasce orarie");

    return res.json();
}

/**
 * Recupera i dati delle fasce orarie di un sanitario
*/
export async function getFasceDisponibilita(uid) {
    const res = await fetch(`${BASE_URL}/sanitari/${uid}/fasce_disponibilita`);
    
    if(!res.ok) throw new Error("Errore nella richiesta dei dati del sanitario.");

    const data = await res.json();

    return data.disponibilita;
}


export async function getSpecialistaInfo(uid, callback) {
    const res = await fetch(`${BASE_URL}/sanitari/${uid}/info`);

    if(!res.ok) throw new Error("Errore nella richiesta dei dati del sanitario.");

    const data = await res.json();

    const stringa = `${data.nome} ${data.cognome} – ${data.specialistica}`;
    callback(stringa);
}

/**
 * Recupera tutta la lista dei sanitari 
*/
export async function  getListaSanitari() {
    const res = await fetch(`${BASE_URL}/sanitari/lista-sanitari`);
    
    if(!res.ok) throw new Error("Errore nella lista saniari: ");

    return res.json()
}



// ! API APPUNTAMENTI

/**
 * Pubblica un appuntamento
*/
export async function postAppuntamento(appuntamento) {
    const res = await fetch(`${BASE_URL}/appuntamenti`,  {
        method: "POST",
        headers: {"Content-type" : "application/json"},
        body: JSON.stringify(appuntamento)
    })

    if(!res.ok) throw new Error("Errore nel salvataggio dell'appuntamento");

    return res.json();
}

/**
 * Recupera un appuntamento
*/
export async function  getAppuntamento(idAppuntamento) {
    const res = await fetch(`${BASE_URL}/appuntamenti/${idAppuntamento}`);

    if(!res.ok) throw new Error("Errore nel recupero dell'appuntamento.");
    
    return res.json();
}


/**
 * Recupera gli appuntamenti futuri 
*/
export async function  getAppuntamentiSanitario(uidSan) {
    const res = await fetch(`${BASE_URL}/appuntamenti/${uidSan}`);

    if(!res.ok) throw new Error("Errore nel recupero dell'appuntamento.");
    
    return res.json();
}

/**
 * Modifica lo stato di un appuntamento in "confermato"
*/
export async function  putAppuntamentiConferma(idAppuntamento) {
    const res = await fetch(`${BASE_URL}/appuntamenti/${idAppuntamento}/conferma`, {
        method: "PUT",
        headers: {"Content-type" : "application/json"}
    })

    if(!res.ok) throw new Error("Errore nel recupero dell'appuntamento");

    return res.json();
}

/**
 * Modifica lo stato di un appuntamento in "cancellato"
*/
export async function  putAppuntamentiCancella(idAppuntamento) {
    const res = await fetch(`${BASE_URL}/appuntamenti/${idAppuntamento}/cancella`, {
        method: "PUT",
        headers: {"Content-type" : "application/json"}
    })

    if(!res.ok) throw new Error("Errore nel recupero dell'appuntamento");

    return res.json();
}

// ==============================
// ASCOLTA IN TEMPO REALE GLI APPUNTAMENTI CONFERMATI DI UN SANITARIO
// stato può essere "confermato" "cancellato" "attesa"
// =============================
export function ascoltaAppuntamenti(uidSanitario, stato, callback) {
    if(!uidSanitario) return () => {};

    const condizioni = [
        where("idSan", "==", uidSanitario),
    ];

    if(stato !== undefined && stato !== null) {
        condizioni.push(where("stato", "==", stato));
    }

    const q = query(collection(db, "appuntamenti"), ...condizioni);

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const risultati = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        }));
        callback(risultati);
    });

    return unsubscribe;
}

// ==============================
// ASCOLTA IN TEMPO REALE GLI APPUNTAMENTI DI UN PAZIENTE
// =============================
export default function ascoltaAppuntamentiPAZ(uidPaziente, callback) {
    if(!uidPaziente) return () => {};

    const q = query(
        collection(db, "appuntamenti"),
        where("idPaz", "==", uidPaziente)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const risultati = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(risultati);
    })

    return unsubscribe;
}

/**
 * Pubblica il referto corrispondente ad un appuntamento
*/
export async function putReferto(idAppuntamento, data,){
    const res = await fetch(`${BASE_URL}/appuntamenti/${idAppuntamento}/carica-referto`, {
        method: "PUT",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
            referto: data.referto,
            refertoURL: data.refertoURL
        })
    })
    if(!res.ok) throw new Error("Errore nel caricamento del referto");

    return res.json();
}

// ! API PAZIENTI ASSOCIATI A SANITARI

/**
 * Crea un paziente associato ad un appuntamento
*/
export async function registraPazienteAppuntamento(idAppuntamento) {
    const res = await fetch(`${BASE_URL}/elenco-pazienti/${idAppuntamento}/registra-paziente`, {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
    })

    if(!res.ok) throw new Error("Errore nella creazione del paziente dopo l'appuntamento.");

    return res.json();
}

/**
 * Recupera i pazienti associati ad un sanitario 
*/
export async function getPazientiSanitario(idSan) {
    const res = await fetch(`${BASE_URL}/elenco-pazienti/${idSan}`);
    
    if(!res.ok) throw new Error("Errore nel recupero dei pazienti." );
    
    return res.json();
}

/**
 * Recupera il referto di un paziente 
*/
export async function getPazienteReferto(idSan, idPaz) {
    const res = await fetch(`${BASE_URL}/elenco-pazienti/${idSan}/${idPaz}`);

    if(!res.ok) throw new Error("Errore nel recupero del paziente." );
    
    return res.json();
}


export async function getPazienteRefertoModifica(idSan, idPaz, nomeCognome, dataNascita, luogoNascita) {
    const res = await fetch(`${BASE_URL}/elenco-pazienti/${idSan}/${idPaz}/modifica-dati`, {
        method: "PUT",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            nomeCognome,
            dataNascita,
            luogoNascita
        })
    });

    if(!res.ok) throw new Error("Errore nella modifica dei dati paziente");

    return res.json();
}

// ! API RECENSIONI

// POST Recensione
export async function postRecensione(idSan, idPaz, recensione) {
    const res = await fetch(`${BASE_URL}/recensioni/${idSan}/${idPaz}`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(recensione)
    });

    if(!res.ok) throw new Error("Errore nel post della recensione.");

    return res.json();
}

export async function getRecensioniSanitario(idSan) {
    const res = await fetch(`${BASE_URL}/recensioni/${idSan}`);
    
    if(!res.ok) throw new Error("Errore nel recupero delle recensioni." );
    
    return res.json();
}

export async function getListaRecensioni() {
    const res = await fetch(`${BASE_URL}/recensioni/lista-recensioni`);
    
    if(!res.ok) throw new Error("Errore nel recupero delle recensioni." );
    
    return res.json();
}

// ! API DOMANDE
export async function postDomanda(newDomanda) {
    const res = await fetch(`${BASE_URL}/domande/nuova-domanda`, {
        method: "POST",
        headers: {"Content-type" : "application/json" },
        body: JSON.stringify(newDomanda),
    });

    if(!res.ok) throw new Error("Errore nel post della domanda: ");

    return res.json();
}

export async function getDomanda(idDomanda) {
  const url = `${BASE_URL}/domande/${encodeURIComponent(idDomanda)}`;
  let res;
  try {
    res = await fetch(url, { method: "GET" });
  } catch (e) {
    console.error("Network/CORS error:", e);
    throw e;
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Errore nel recupero della domanda (HTTP ${res.status})`);
  }
  return res.json();
}


export function getListaDomande(callback) {
  const q = query(collection(db, "domande"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const risultati = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(risultati);
  });

  return unsubscribe;
}

export async function putIgnoraDomanda(idSan, idDomanda) {
    const res = await fetch(`${BASE_URL}/domande/ignora-domanda`, {
        method: "PUT",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({idSan, idDomanda})
    })

    if(!res.ok) throw new Error(`Errore nel recupero della domanda: ${res.statusText}`);

    return res.json();
}

export async function putRispostaSanitario(risposta) {
    const res = await fetch(`${BASE_URL}/domande/risposta`, {
        method: "PUT",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(risposta)
    })

    if(!res.ok) throw new Error("Errore nel put della risposta: ");

    return res.json();
}

export async function getListaDomandePaziente(idPaz) {
    const res = await fetch(`${BASE_URL}/domande/paziente/${idPaz}`);
    
    if(!res.ok) throw new Error("Errore nel get delle domande del paziente: ");

    return res.json();
}

export async function getListaDomandeWidget() {
    const res = await fetch(`${BASE_URL}/domande/lista-domande/widget`);
    
    if(!res.ok) throw new Error("Errore nel get delle domande: ");

    return res.json();
}
