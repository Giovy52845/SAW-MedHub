const express = require("express");
const router = express.Router();
const { db } = require("../firebase-admin");

/**
 * @route   GET /api/specialistiche
 * @desc    Recupera tutte le specialistiche sanitarie
*/
router.get("/", async (req, res) =>{
    try {
        const snapshot = await db.collection("specialistiche").get()
        
        const specialistiche = snapshot.docs.map(doc => ({
            id: doc.id,
            nome: doc.data().nome
        }));

        res.status(200).json(specialistiche);
    } catch (err) {
        console.error("Errore nel recupero delle specialistiche;", err);
        res.status(500).json({error: "Errore interno al server"});
    }
})

module.exports = router;