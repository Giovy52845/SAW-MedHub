const express = require("express")
const router = express.Router();
const admin = require("firebase-admin")
const { db } = require("../firebase-admin");
const { getSanitarioData } = require("../../frontend/src/api/api");

router.post("/nuova-domanda", async (req, res) => {
    const {idAutore, testoDomanda, dataDomanda} = req.body;
    try {
        const docRef = db.collection("domande").doc();
        const idDomanda = docRef.id;

        await docRef.set({
            idDomanda,
            idAutore,
            testoDomanda,
            dataDomanda,
            risposte: []
        });

        return res.status(200).json({ success: true, messaggio: "Domanda creata con successo." });
    } catch (err) {
        console.error("Errore durante il salvataggio della domanda:", err);
        return res.status(500).json({error: "Errore inserimento domanda."});
    }
})

router.get("/lista-domande", async (req, res) => {
    try {
        const snapshot = await db.collection("domande").get();

        if (snapshot.empty) {
            return res.status(404).json({ error: "Nessuna domanda trovata" });
        }

        const listaDomande = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
        }));

        return res.status(200).json(listaDomande);

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
        return res.status(500).json({ error: "Errore del server" });
    }
});

router.put("/ignora-domanda", async (req, res) => {
    const {idSan, idDomanda} = req.body;
    try{
        const docRef = db.collection("domande").doc(idDomanda);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({error: "Domanda non trovata"});
        }

        await docRef.update({
            ignoratoDa: admin.firestore.FieldValue.arrayUnion(idSan)
        })

        return res.status(200).json({success: true, messaggio: "Domanda ignorata con successo."});
    }catch (err) {
        console.error("Errore nel recupero dei dati: ", err);
        res.status(500).json({error: "Errore interno al server"});
    }
});

router.put("/risposta", async (req, res) => {
    const {
        idDomanda,
        idSan,
        risposta,
        dataRisposta
    } = req.body;

    try {
        // Recupero la domanda
        const domRef = db.collection("domande").doc(idDomanda);
        const domSnap = await domRef.get();

        if(!domSnap.exists) {
            return res.status(404).json({error: "Domanda non trovata"});
        }

        // Recupero i dati del sanitario
        const sanRef = db.collection("sanitari").doc(idSan);
        const sanSnap = await sanRef.get();
        if(!sanSnap.exists) {
            return res.status(404).json({error: "Sanitario non trovato"});
        }
        const sanitarioData = sanSnap.data();

        const nome = sanitarioData.nome[0].toUpperCase() + sanitarioData.nome.substring(1);
        const cognome = sanitarioData.cognome[0].toUpperCase() + sanitarioData.cognome.substring(1);
        const nomeCognome = `${nome} ${cognome}`;
        
        const citta = sanitarioData.citta[0].toUpperCase() + sanitarioData.citta.substring(1);

        // Oggetto risposta
        const newRisposta = {
            idSan,
            risposta,
            dataRisposta,
            nomeCognome,
            fotoProfilo: sanitarioData?.fotoProfiloURL,
            spec: sanitarioData?.specializzazione,
            valMedia: sanitarioData?.valutazioneMedia,
            slug: sanitarioData?.slug,
            citta
        }

        await domRef.update({
            risposte: admin.firestore.FieldValue.arrayUnion(newRisposta)
        })

        return res.status(200).json({success: true, messaggio: "Risposta inviata con successo."});
    }catch (err) {
        console.error("Errore nel recupero dei dati: ", err);
        res.status(500).json({error: "Errore interno al server"});
    }
})


router.get("/:idDomanda", async (req, res) => {
    const { idDomanda } = req.params;

    try {
        const docRef = db.collection("domande").doc(idDomanda);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({ error: "Domanda non trovata." });
        }

        const data = docSnap.data();
        return res.status(200).json({ id: docSnap.id, ...data });

    } catch (error) {
        console.error("Errore nel recupero della domanda:", error);
        return res.status(500).json({ error: "Errore del server" });
    }
});

router.get("/paziente/:idPaz", async (req, res) => {
    const { idPaz } = req.params;
    try {
        const querySnap = await db.collection("domande")
                                  .where("idAutore", "==", idPaz)
                                  .get();
        // Non ci sono domande pubblicate dall'utente.
        if(querySnap.empty) {
            return res.status(200).json([]);
        }
        const listaDomande = querySnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return res.status(200).json(listaDomande);

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
        return res.status(500).json({ error: "Errore del server" });
    }
});

router.get("/lista-domande/widget", async (req, res) => {
  try {
    const queryRef = db.collection("domande")
                       .limit(2)
                       .orderBy("dataDomanda", "desc");

    const querySnap = await queryRef.get();

    if (querySnap.empty) {
      return res.status(200).json([]);
    }

    const listaDomande = querySnap.docs.map(doc => {
      const data = doc.data();
      const primaRisposta = Array.isArray(data.risposte) && data.risposte.length > 0 
        ? data.risposte[0] 
        : null;

      return {
        id_message: doc.id,
        message: data.testoDomanda,
        risposte: primaRisposta
          ? {
              nome_medico: primaRisposta.nomeCognome || null,
              img_doc: primaRisposta.fotoProfilo || null,
              messaggio_risposta: primaRisposta.risposta || null
            }
          : null
      };
    });
    return res.status(200).json(listaDomande);

  } catch (error) {
    console.error("Errore nel recupero delle domande:", error);
    return res.status(500).json({ error: "Errore del server" });
  }
});

module.exports = router;