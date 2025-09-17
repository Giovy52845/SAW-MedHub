const express = require("express")
const router = express.Router();
const { db } = require("../firebase-admin");

/** 
 * @route   POST /api/verifica-sanitario
 * @desc    Verifica che il sanitario che si sta registrando sia regolarmente iscritto all'Ordine
*/
router.post("/", async (req, res) => {
    const { nome, cognome, numero_ordine } = req.body;

    if(!nome || !cognome || !numero_ordine){
        return res.status(400).json({error: "Dati mancanti" });
    }

    const docId = `${nome.toLowerCase()}_${cognome.toLowerCase()}_${numero_ordine}`;
    try {
        const docRef = db.collection("medici_farlocchi").doc(docId);
        const snapshot = await docRef.get();

        if(!snapshot.exists) {
            return res.status(404).json({valido: false, messaggio: "Medico non trovato"});
        }

        return res.status(200).json({valido: true, messaggio: "Medico verificato"});
    } catch (err) {
        console.error("Errore nella verifica:", err);
        return res.status(500).json({error: "Errore interno al server"});
    }
})

module.exports = router;