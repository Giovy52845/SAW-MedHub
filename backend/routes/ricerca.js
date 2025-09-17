const express = require("express");
const router = express.Router();
const { db } = require("../firebase-admin");

router.get("/", async (req, res) => {
    const {spec, citta, modalita} = req.query;
    try{
        let q = db.collection("sanitari");

        if(modalita) {
          const m = modalita.toLowerCase().trim();
          if(m === "online"){
            q = q.where("modalita_visita.online", "==", true);
          } else {
            q = q.where("modalita_visita.studio", "==", true);
            if(citta) {
              q = q.where("modalita_visita.citta_normalized", "==", citta);
            }
          }
        }

        if(spec) {
            q = q.where("specializzazione", "==", spec);
        }

        q = q.select("nome", 
                     "cognome", 
                     "fotoProfiloURL", 
                     "modalita_visita",
                     "specializzazione",
                     "comp_specifiche",
                     "slug",
                     "recensioniCount",
                     "valutazioneMedia",
                     "prestazioni"
                    );

        const snapshot = await q.get();

        if(snapshot.empty) {
            return res.json([]);
        }

        const results = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        return res.json(results)

    } catch(err) {
        return res.status(500).json({error: "Errore interno al server"});
    }
})

router.get("/lista-sanitari", async (req, res) => {
  try {
    const queryRef = db.collection("sanitari")
                       .select("nome", "cognome", "citta", "slug", "specializzazione");

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


module.exports = router;