const express = require("express")
const router = express.Router();
const { db } = require("../firebase-admin");

const { Timestamp } = require("firebase-admin").firestore;

/**
 * @route POST /api/appuntamenti
 * @desc Prenota un appuntamento
 */
router.post("/", async (req, res) => {
    const { idSan, 
            idPaz, 
            nomeCognomePAZ,
            email,
            data, 
            giorno, 
            hInizio, 
            hFine, 
            tipo, 
            prestazione, 
            stato,
            timestamp } = req.body;

    try {
        const docRef = db.collection("appuntamenti").doc();
        const idAppuntamento = docRef.id;
        
        await docRef.set({
            idAppuntamento,
            idSan,
            idPaz,
            nomeCognomePAZ,
            email,
            data,
            giorno,
            hInizio,
            hFine,
            tipo,
            prestazione,
            stato,
            timestamp
        })

        return res.status(200).json({ success: true, messaggio: "Appuntamento creato con successo." });
    } catch (err) {
        console.error("Errore durante il salvataggio dell'appuntamento:", err);
        return res.status(500).json({error: "Errore inserimento appuntamento."});
    }
})

/**
 * @route GET /api/appuntamenti/:idAppuntamento
 * @desc Recupera un appuntamento
 */
router.get("/:idAppuntamento", async (req, res) => {
    const { idAppuntamento } = req.params;

    try {
        const docRef = await db.collection("appuntamenti").doc(idAppuntamento);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Appuntamento non trovato" });
        }
        const data = docSnap.data();
        return res.status(200).json({ id: docSnap.id, ...data });

    } catch (error) {
        console.error("Errore nel recupero dell'appuntamento:", error);
        return res.status(500).json({ error: "Errore del server" });
    }
});

/**
 * @route GET /api/appuntamento/:uidSan
 * @desc Controlla tutti gli appuntamenti di un sanitario
 */
router.get("/:uidSan", async (req, res) => {
    const { uidSan } = req.params;

    try {
        const snapshot = await db.collection("appuntamenti")
                                 .where("idSan", "==", uidSan)
                                 .orderBy("timestamp", "asc")
                                 .get()
        const appuntamenti = snapshot.docs.map(doc => doc.data());

        return res.status(200).json(appuntamenti);
    } catch (error) {
        console.error("Errore nel recupero degli appuntamenti futuri:", error);
        return res.status(500).json({error: "Errore nel recupero degli appuntamenti."});
    }
})

/**
 * @route PUT /api/appuntamento/:idAppuntamento/conferma
 * @desc Modifica lo stato di un appuntamento mettendolo su "confermato"
 */
router.put("/:idAppuntamento/conferma", async (req, res) => {
    const { idAppuntamento } = req.params;

    try {
        const docRef = db.collection("appuntamenti").doc(idAppuntamento);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Appuntamento non trovato" });
        }

        await docRef.update({
            stato: "confermato"
        });

        return res.status(200).json({success: true, messaggio: "Appuntamento modificato con successo."});
    }catch (err) {
        console.error("Errore nel recupero dei dati: ", err);
        res.status(500).json({error: "Errore interno al server"});
    }
});

/**
 * @route PUT /api/appuntamento/:idAppuntamento/cancella
 * @desc Modifica lo stato di un appuntamento su "cancellato"
 */
router.put("/:idAppuntamento/cancella", async (req, res) => {
    const { idAppuntamento } = req.params;

    try {
        const docRef = db.collection("appuntamenti").doc(idAppuntamento);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Appuntamento non trovato" });
        }

        await docRef.update({
            stato: "cancellato"
        });

        return res.status(200).json({success: true, messaggio: "Appuntamento modificato con successo."});
    }catch (err) {
        console.error("Errore nel recupero dei dati: ", err);
        res.status(500).json({error: "Errore interno al server"});
    }
});

/**
 * @route PUT /api/appuntamento/:idAppuntamento/carica-referto
 * @desc Modifica lo stato di un appuntamento su "refertato" e carica il referto
 */
router.put("/:idAppuntamento/carica-referto", async (req, res) => {
    const { idAppuntamento } = req.params;
    const { referto, refertoURL} = req.body;

    try {
        const docRef = db.collection("appuntamenti").doc(idAppuntamento);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Appuntamento non trovato" });
        }

        await docRef.update({
            referto,
            refertoURL,
            stato: "refertato"
        });

        return res.status(200).json({success: true, messaggio: "Appuntamento modificato con successo."});
    }catch (err) {
        console.error("Errore nel recupero dei dati: ", err);
        res.status(500).json({error: "Errore interno al server"});
    }
});

module.exports = router;