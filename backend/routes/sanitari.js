const express = require("express");
const router = express.Router();
const { db } = require("../firebase-admin");

/**
 * @route   POST /api/sanitari
 * @desc    Registra un nuovo sanitario
 */

router.post("/", async (req, res) =>{
    const {
            uid, slug, nome, cognome, email, telefono, citta,
            specializzazione, numero_ordine, ordine_citta,
        } = req.body;

    try {
        const docRef = db.collection("sanitari").doc(uid);
        await docRef.set({
            uid,
            slug,
            ruolo: "sanitario",
            nome,
            cognome,
            email,
            telefono,
            citta,
            specializzazione,
            numero_ordine,
            ordine_citta,
            bio: "",
            fotoProfiloURL: "https://firebasestorage.googleapis.com/v0/b/medhub-577e7.firebasestorage.app/o/immagini_profilo%2Favatar_no_profile_picture.jpg?alt=media&token=0e92beff-7762-4817-9333-5880ccfad2cc",
            immagini_studio: [],
            recensioniCount: 0,
            valutazioneMedia: 0,
            tipoAppuntamento: "",
            visiteDisponibili: [],
            dataRegistrazione: new Date()
        });
        
        return res.status(201).json({success: true, messaggio: "Sanitario registrato con successo"});
    } catch (err) {
        console.error("Errore durante il salvataggio:", err.message, err.stack);
        
        return res.status(500).json({ error: "Errore interno al server." });
    }
})

router.get("/lista-sanitari", async (req, res) => {
  try {
    const queryRef = db.collection("sanitari")
                       .orderBy("dataRegistrazione", "desc")
                       .limit(6)
                       .select("nome", "cognome", "citta", "fotoProfiloURL", "slug", "specializzazione");

    const querySnap = await queryRef.get();

    if (querySnap.empty) {
      return res.status(404).json({ error: "Sanitari non trovati." });
    }

    const listaSanitari = querySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(listaSanitari);
  } catch (err) {
    console.error("Errore nel recupero dei dati dei sanitari:", err);
    return res.status(500).json({ error: "Errore interno al server" });
  }
});

/**
 * @route GET /api/sanitari/:uid
 * @desc Recupera i dati di un paziende da Firestore
 */
router.get("/:uid", async(req, res) => {
    const { uid } = req.params;
    try {
        const docRef = db.collection("sanitari").doc(uid);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({error: "Sanitario non trovato"});

        }

        const userData = {
            uid: docSnap.id,
            ...docSnap.data(),
        };

        return res.status(200).json(userData);
    } catch(err) {
        console.error("Errore nel recupero dei dati del sanitario.");
        res.status(500).json({error: "Errore interno al server"});
    }
});

/**
 * @route PUT /api/sanitari/:uid/bio
 * @desc Aggiorna i dati di un sanitario su Firestore
 */
router.put("/:uid/bio", async (req, res) => {
    const { uid } = req.params;
    const { comp_specifiche, formazione, anni_esperienza, bio} = req.body;

    try {
        const docRef = db.collection("sanitari").doc(uid);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Sanitario non trovato"});
        }

        await docRef.update({
            bio: bio,
            comp_specifiche: comp_specifiche,
            formazione: formazione,
            anni_esperienza: anni_esperienza
        });

        return res.status(200).json({success: true, messaggio: "Sanitario aggiornato con successo"});
    } catch (err) {
        console.error("Errore nel recupero dei dati: ", err);
        res.status(500).json({error: "Errore interno al server"});
    }
});

/**
 * @route PUT /api/sanitari/:uid/tariffe
 * @desc Aggiorna i dati delle tariffe di un sanitario su Firestore
 */
router.put("/:uid/tariffe", async (req, res) => {
    const { uid } = req.params;
    const { prestazioni } = req.body;

    try {
        const docRef = db.collection("sanitari").doc(uid);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Sanitario non trovato"});
        }

        await docRef.update(
            { prestazioni }
        );

        return res.status(200).json({success: true, messaggio: "Prestazioni aggiornate con successo"});
    } catch (err) {
        console.error("Errore nel recupero dei dati: ", err);
        res.status(500).json({error: "Errore interno al server"});
    }
});


/**
 * @route PUT /api/sanitari/:uid/modalita-visite
 * @desc Aggiorna i dati di un sanitario su Firestore
 */
router.put("/:uid/modalita-visite", async (req, res) => {
    const { uid } = req.params;
    const { modalita_visita } = req.body;

    try {
        const docRef = db.collection("sanitari").doc(uid);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Sanitario non trovato"});
        }

        await docRef.update(
            { modalita_visita }
        );

        return res.status(200).json({success: true, messaggio: "Modalità appuntamenti aggiornata con successo"});
    } catch (err) {
        console.error("Errore nel recupero dei dati: ", err);
        res.status(500).json({error: "Errore interno al server"});
    }
});

/**
 * @route PUT /api/sanitari/:uid/foto-profilo
 * @desc Aggiorna l'immagine di profilo di un sanitario su Firestore
 */
router.put("/:uid/foto-profilo", async (req, res) => {
    const { uid } = req.params;
    
    const { fotoProfiloURL } = req.body;

    try {
        const docRef = db.collection("sanitari").doc(uid);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Sanitario non trovato"});
        }

        await docRef.update(
            { fotoProfiloURL }
        );

        return res.status(200).json({success: true, messaggio: "Foto profilo aggiornata con successo"});
    } catch (err) {
        console.error("Errore nel recupero dei dati: ", err);
        res.status(500).json({error: "Errore interno al server"});
    }
});

/**
 * @route PUT /api/sanitari/:uid/fasce_disponibilita
 * @desc Crea una Subcollection per le fasce orarie in cui visita il sanitario
 */
router.put("/:uid/fasce_disponibilita", async (req, res) => {
    const { uid } = req.params;
    const { disponibilita } = req.body;
    try {
        const docRef = db.collection("sanitari").doc(uid);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Sanitario non trovato"});
        }
        
        await docRef.update({disponibilita});

        return res.status(200).json({ messaggio: "Fasce orarie salvate correttamente" });
    } catch(err) {
        console.error("Errore BACKEND (fasce_disponibilita):", err);
        return res.status(500).json({messaggio: "Errore nel server" });
    }
})

/**
 * @route GET /api/sanitari/:uid/fasce_disponibilita
 * @desc Recupera dal DB le fasce di disponibilita di un sanitario
 */
router.get("/:uid/fasce_disponibilita", async (req, res) => {
    const { uid } = req.params;
    try {
        const docRef = db.collection("sanitari").doc(uid);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Sanitario non trovato" });
        }

        const data = docSnap.data();

        return res.json({disponibilita: data.disponibilita || {} });
    } catch (err) {
        console.error("Si è verificato un errore: ", err);
        return res.status(500).json( {error: "Si è verificato un errore interno al server" });
    }
})

/**
 * @route GET /api/sanitari/:uid/infoa
 * @desc Recupera il nome cognome e specialistica
 */
router.get("/:uid/info", async (req, res) => {
    const { uid } = req.params;

    try {
        const docRef = db.collection("sanitari").doc(uid);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ error: "Sanitario non trovato" });
        }

        const data = docSnap.data();

        // Recupero la specialistica
        const specRef = db.collection("specialistiche").doc(data.specializzazione);
        const specSnap = await specRef.get();

        if (!specSnap.exists) {
            return res.status(404).json({ error: "Specialistica non trovata" });
        }

        const dataSpec = specSnap.data();

        const nomeSpecialistica = dataSpec.nome;

        // Funzione per mettere maiuscola la prima lettera
        const capitalize = (str) =>
            str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

        // Capitalizza nome e cognome
        const nome = capitalize(data.nome);
        const cognome = capitalize(data.cognome);

        return res.json({
            nome,
            cognome,
            specialistica: nomeSpecialistica
        });

    } catch (err) {
        console.error("Si è verificato un errore: ", err);
        return res.status(500).json({ error: "Si è verificato un errore interno al server" });
    }
});

module.exports = router;