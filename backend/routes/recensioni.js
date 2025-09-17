const express = require("express");
const router = express.Router();
const { db } = require("../firebase-admin");

/**
 * @route POST /api/recensioni/:idSan/:idPaz
 * @desc Carica sul database la recensione dell'utente e imposta la verifica se ha effettuato
 *       almeno un appuntamento refertato
 */
router.post("/:idSan/:idPaz", async (req, res) => {
    const { idSan, idPaz } = req.params;
    const {
        valRecensione,
        recensione,
        firma,
        prestazione
    } = req.body;
    let verifica = false;

    try {
        // Controllo che almeno un appuntamento sia refertato
        const appRef = await db.collection("appuntamenti")
                         .where("idSan", "==", idSan)
                         .where("idPaz", "==", idPaz)
                         .where("stato", "==", "refertato")
                         .get();
        if(!appRef.empty) {
            verifica = true;
        }
        

        // Creo la recensione
        const recRef = await db.collection("recensioni").add({
            idSan,
            idPaz,
            valRecensione: Number(valRecensione),
            recensione,
            firma,
            prestazione,
            verifica,
            timestamp: Date.now()
        });
        
        // Aggiorno il conteggio della valutazione sul profilo del sanitario
        const sanRef = db.collection("sanitari").doc(idSan);
        const sanSnap = await sanRef.get();

        if(!sanSnap.exists) {
            throw new Error("Sanitario non trovato.");
        }

        const datiSanitario = sanSnap.data();
        const valutazioneAttuale = datiSanitario.valutazioneMedia;
        const recensioniCountAttuale = datiSanitario.recensioniCount;

        const nuovaValutazioneMedia = (
            (valutazioneAttuale * recensioniCountAttuale + Number(valRecensione)) /
            (recensioniCountAttuale + 1)
        ).toFixed(2);

        await sanRef.update({
            valutazioneMedia: Number(nuovaValutazioneMedia),
            recensioniCount: recensioniCountAttuale + 1
        });
        
        return res.status(200).json({ success: true, messaggio: "Recensione creata con successo." });
    } catch(err) {
        console.error("Si è verificato un errore nella recensione: ", err);
        return res.status(500).json({error: "Errore inserimento appuntamento."});
    }
})

router.get("/lista-recensioni", async (req, res) => {
  try {
    const queryRef = db.collection("recensioni")
                     .limit(3)
                     .select("firma", "recensione", "valRecensione", "idSan")
                     .orderBy("timestamp", "desc");
    
    const querySnap = await queryRef.get();

    if(querySnap.empty) {
      return res.status(404).json({ error: "Recensioni non trovate." });
    }

    // Recupero le recensioni
    const listaRecensioni = querySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Recupero gli uid dei sanitari
    const uidSanUnici = [...new Set(listaRecensioni.map(san => san.idSan))];
    const sanDocs = await Promise.all(
      uidSanUnici.map(idSan => db.collection("sanitari").doc(idSan).get())
    );

    // Mappa idSan -> dati sanitario
    const sanById = {};

    sanDocs.forEach(docSan => {
      if (docSan.exists) {
        sanById[docSan.id] = docSan.data();
      }
    });

    // Completo le recensioni con i dati che mi interessano

    const recensioniFinali = listaRecensioni.map(data => ({
      id_review: data.id,
      name_doc: `${sanById[data.idSan].nome[0].toUpperCase() + sanById[data.idSan].nome.slice(1)} ${sanById[data.idSan].cognome[0].toUpperCase() + sanById[data.idSan].cognome.slice(1)}`,
      img_url: sanById[data.idSan].fotoProfiloURL,
      star: data.valRecensione,
      message: data.recensione,
      nome_utente: data.firma,
      slug: sanById[data.idSan].slug,
    }));
    return res.json(recensioniFinali);

  } catch(err) {
    console.error("Si è verificato un errore: ", err);
    return res.status(500).json({ error: "Errore interno al server" });
  }
})

router.get("/:idSan", async (req, res) => {
  const { idSan } = req.params;

  try {
    const snapshot = await db
      .collection("recensioni")
      .where("idSan", "==", idSan)
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const recensioni = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(recensioni);
  } catch (err) {
    console.error("Errore nel recupero recensioni:", err);
    return res.status(500).json({ error: "Errore durante il recupero delle recensioni." });
  }
});

module.exports = router;