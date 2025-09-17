const express = require("express");
const router = express.Router();
const { db } = require("../firebase-admin");

/**
 * @route   GET /api/pazienti/:uid
 * @desc    Recupera i dati di un paziente da Firestore
 */
router.get("/:uid", async(req, res) => {
    const { uid } = req.params;
    try {
        const docRef = db.collection("pazienti").doc(uid);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Utente non trovato "});
        }

        const userData = {
            uid: docSnap.id,
            ...docSnap.data(),
        };

        return res.status(200).json(userData);

    } catch (err) {
        console.error("Errore nel recupero dei dati del paziente", err);
        res.status(500).json({ error: "Errore interno al server" });
    }
});

/**
 * @route   PUT /api/pazienti/:uid
 * @desc    Aggiorna i dati di un paziente su Firestore
 */

router.put("/:uid", async (req, res) => {
    const { uid } = req.params;
    const { nome, cognome, firma, citta, dataNascita, gender, telefono } = req.body;

    try {
        const docRef = db.collection("pazienti").doc(uid);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Utente non trovato" });
        }

        await docRef.update({
            nome: nome,
            cognome: cognome,
            firma: firma,
            citta: citta,
            dataNascita: dataNascita,
            gender: gender,
            telefono: telefono
        });

        return res.status(200).json({ success: true, messaggio: "Dati modificati con successo" });
    } catch (err) {
        console.error(" Errore nel recupero dei dati:", err);
        res.status(500).json({ error: "Errore interno al server" });
    }
});


/**
 * @route  DELETE /api/pazienti/:uid
 * @desc   Elimina un paziente dal Firestore
 */
router.delete("/:uid", async (req, res) => {
    const { uid } = req.params;
    try {
        const docRef = db.collection("pazienti").doc(uid);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Utente non trovato"});
        }

        await docRef.delete();

        return res.status(200).json({ success: true, messaggio: "Paziente eliminato con successo." });
    } catch (err) {
        console.error("Errore durante l'eliminazione del paziente:", err);
        res.status(500).json({ error: "Errore interno al server" });
    }
});

/**
 * @route   POST /api/paziente
 * @desc    Registra un nuovo paziente
 */
router.post("/", async (req, res) => {
    const { uid, email } = req.body;

    try {
        const docRef = db.collection("pazienti").doc(uid);
        await docRef.set({
            uid,
            ruolo: "paziente",
            nome: "",
            cognome: "",
            email,
            firma: "Paziente",
            dataNascita: "",
            gender: "",
            citta: "",
            telefono: "",
            dataRegistrazione: new Date()
        });

        return res.status(200).json({success: true, messaggio: "Paziente creato con successo."});
    
    } catch (err) {
        console.error("Errore durante il salvataggio:", err);
        
        res.status(500).json({error: "Errore interno al server," });
    }
})

/**
 * @route   PUT /api/pazienti/:uid/preferiti/:uidSan
 * @desc    Aggiunge un sanitario alla lista dei preferiti
 */
router.put("/:uidPaz/preferiti/:uidSan", async (req, res) => {
    const { uidPaz, uidSan } = req.params;
    const {uid, nome, cognome, slug, spec, imgURL} = req.body;
    try {
        const docRef = db.doc(`pazienti/${uidPaz}/preferiti/${uidSan}`);
        await docRef.set({
            uid,
            nome,
            cognome,
            slug,
            specializzazione: spec,
            imgURL
        });

        return res.status(200).json({messaggio: "Sanitario salvato nei preferiti"});
    } catch (err) {
        console.error("ERRORE BACKEND:", err);
        return res.status(500).json({messaggio: "Errore nel server"});
    }
})

/**
 * @route   DELETE /api/pazienti/:uid/preferiti/:uidSan
 * @desc    Elimina un sanitario dalla lista dei preferiti
 */
router.delete("/:uidPaz/preferiti/:uidSan", async (req, res) => {
    const { uidPaz, uidSan } = req.params;

    try {
        const docRef = db.doc(`pazienti/${uidPaz}/preferiti/${uidSan}`);
        await docRef.delete();

        return res.status(200).json({message: "Sanitario rimosso dai preferiti" });
    } catch(err) {
        console.error("Errore durante la rimozione:", err);
        return res.status(500).json({ message: "Errore nel server" });
    }
});

/**
 * @route   GET /api/pazienti/:uid/preferiti/:uidSan
 * @desc    Verifica se un Sanitario è tra i preferiti
 */
router.get("/:uidPaz/preferiti/:uidSan", async (req, res) => {
    const { uidPaz, uidSan } = req.params;

    try {
        const docRef = db.doc(`pazienti/${uidPaz}/preferiti/${uidSan}`);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json( {message: "Non trovato"});
        }

        return res.status(200).json(docSnap.data());
    } catch(err) {
        console.error("Si è verificato un errore durante il check preferito:", err);
        return res.status(500).json({ message: "Errore nel server" });
    }
})

/**
 * @route   GET /api/pazienti/:uid/preferiti
 * @desc    Prende tutti i preferiti di un paziente
 */
router.get("/:uid/preferiti", async (req, res) => {
    const { uid } = req.params;

    try {
        const docRef = db.collection(`pazienti/${uid}/preferiti`);
        const docSnap = await docRef.get();

        if(docSnap.empty) {
            return res.status(404).json( {message: "Errore nessun preferito trovato"});
        }

        const preferito = docSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.status(200).json(preferito);
    } catch(err) {
        console.error("Si è verificato un errore durante il get dei preferiti:", err);
        return res.status(500).json({ message: "Errore nel server" });
    }
})

module.exports = router;

