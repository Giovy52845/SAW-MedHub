const express = require("express")
const router = express.Router();
const { db } = require("../firebase-admin");

/**
 * @route /api/elenco-pazienti/:idAppuntamento/registra-paziente
 * @desc Dopo che un appuntamento viene confermato, viene creato un paziente associato a quel sanitario
 */
router.post("/:idAppuntamento/registra-paziente", async (req, res) => {
    const { idAppuntamento } = req.params;
    try {
        const docRef = db.collection("appuntamenti").doc(idAppuntamento);
        const docSnap = await docRef.get();

        if(!docSnap.exists) {
            return res.status(404).json({error: "Appuntamento non trovato."});
        }

        const data = docSnap.data();
        const paziente = {
            idPaz: data.idPaz,
            email: data.email,
            nomeCognome: data.nomeCognomePAZ || null,
            idUltimoApp: idAppuntamento,
            dataUltimoApp: data.data,
            tipoUltimoApp: data.tipo,
            prestUltimoApp: data.prestazione,
        };

        const pazRef = db.doc(`sanitari/${data.idSan}/pazienti/${paziente.idPaz}`);
        const existingSnap = await pazRef.get();
        const prevCount = existingSnap.exists ? (existingSnap.data().conteggioApp || 0) : 0;

        await pazRef.set({
            ...paziente,
            conteggioApp: prevCount + 1
        }, { merge: true });

        return res.status(200).json({messaggio: "Paziente creato con successo."});
    } catch (err) {
        console.error("Errore backend:", err);
        return res.status(500).json({messaggio: "Errore nel server"});
    }
})

/**
 * @route /api/elenco-pazienti/:idSan
 * @desc Recupera tutti pazienti associati ad un sanitario
 */
router.get("/:idSan", async (req, res) => {
  const { idSan } = req.params;
  try {
    const colRef = db.collection(`sanitari/${idSan}/pazienti`);
    const snapshot = await colRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Nessun paziente trovato per questo sanitario." });
    }

    const pazienti = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(pazienti);
  } catch (err) {
    console.error("Errore durante il recupero dei pazienti:", err);
    return res.status(500).json({ message: "Errore nel server" });
  }
});

/**
 * @route /api/elenco-pazienti/:idSan/:idPaz
 * @desc Recupera i dati di un paziente
 */
router.get("/:idSan/:idPaz", async (req, res) => {
  const { idSan, idPaz } = req.params;
  try {
    const docRef = db.collection(`sanitari/${idSan}/pazienti`).doc(idPaz);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Paziente non trovato" });
    }

    const paziente = {
      id: docSnap.id,
      ...docSnap.data()
    };

    return res.status(200).json(paziente);
  } catch (err) {
    console.error("Errore durante il recupero del paziente:", err);
    return res.status(500).json({ message: "Errore del server" });
  }
});

/**
 * @route PUT /api/elenco-pazienti/:idSan/:idPaz/modifica-dati
 * @desc Aggiorna i dati anagrafici di un paziente, solo se modificati
 */
router.put("/:idSan/:idPaz/modifica-dati", async (req, res) => {
  const { idSan, idPaz } = req.params;
  const { nomeCognome, dataNascita, luogoNascita } = req.body;

  try {
    const docRef = db.doc(`sanitari/${idSan}/pazienti/${idPaz}`);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Paziente non trovato" });
    }

    const currentData = docSnap.data();
    const updatedFields = {};

    if (nomeCognome && nomeCognome !== currentData.nomeCognome) {
      updatedFields.nomeCognome = nomeCognome;
    }

    if (dataNascita && dataNascita !== currentData.dataNascita) {
      updatedFields.dataNascita = dataNascita;
    }

    if (luogoNascita && luogoNascita !== currentData.luogoNascita) {
      updatedFields.luogoNascita = luogoNascita;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(200).json({ message: "Nessuna modifica necessaria" });
    }

    await docRef.update(updatedFields);

    return res.status(200).json({ message: "Dati aggiornati con successo", updatedFields });
  } catch (err) {
    console.error("Errore durante l'aggiornamento del paziente:", err);
    return res.status(500).json({ error: "Errore del server" });
  }
});


module.exports = router;