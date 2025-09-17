const express = require('express');
const router = express.Router();
const { admin, db } = require('../firebase-admin');

router.get("/public-vapid-key", (req, res) => {
    res.json({ vapidKey: process.env.FIREBASE_VAPID_PUBLIC_KEY || ""});
});

// Salva token per paziente/sanitario
router.post('/register-token', async (req, res) => {
  const { uid, ruolo, token } = req.body;
  if (!uid || !ruolo || !token) {
    return res.status(400).json({ error: 'uid, ruolo e token obbligatori' });
  }

  try {
    const col = ruolo === 'paziente' ? 'pazienti' : 'sanitari';
    const userRef = db.collection(col).doc(uid);
    const tokenRef = userRef.collection('fcmTokens').doc(token);

    // salva/aggiorna token
    await tokenRef.set({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userAgent: req.get('user-agent') || 'unknown',
    }, { merge: true });

    // segna che le notifiche sono abilitate
    await userRef.set({
      notifiche: true,
      notificheUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    res.json({ ok: true });
  } catch (e) {
    console.error('register-token:', e);
    res.status(500).json({ error: 'Errore salvataggio token' });
  }
});

router.post('/unregister-token', async (req, res) => {
  const { uid, ruolo, token } = req.body;
  if (!uid || !ruolo || !token) {
    return res.status(400).json({ error: 'uid, ruolo e token obbligatori' });
  }

  try {
    const col = ruolo === 'paziente' ? 'pazienti' : 'sanitari';
    const userRef = db.collection(col).doc(uid);
    const tokenRef = userRef.collection('fcmTokens').doc(token);

    // elimina il token
    await tokenRef.delete();

    // conta i token rimasti
    const snap = await userRef.collection('fcmTokens').limit(1).get();
    const hasAny = !snap.empty;

    // aggiorna il flag
    await userRef.set({
      notifiche: hasAny,
      notificheUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    res.json({ ok: true, notifiche: hasAny });
  } catch (e) {
    console.error('unregister-token:', e);
    res.status(500).json({ error: 'Errore disattivazione notifica' });
  }
});


router.post('/notify-send', async (req, res) => {
  const {
    userId,
    role,
    title,
    body,
    url,
    type,
    actions
  } = req.body;

  // Controllo che ci sia l'uid e il ruolo
  if(!userId || !role) {
    return res.status(400).json({error: 'UserId e role sono obbligatori'});
  }
  // In base al ruolo prendo la collezione giusta
  const col = role === 'paziente' ? 'pazienti' : 'sanitari';
  try {
    // Recupero la collezione dell'utente
    const userRef = db.collection(col).doc(userId);
    const userDoc = await userRef.get();
    if(userDoc.exists) {
      // Verifico se può accettare notifiche
      const { notifiche } = userDoc.data() || {};
      if(notifiche === false) {
        return res.status(403).json({error: 'Notifiche disattivate per questo utente'});
      }
    }

    // Raccolgo i token
    const tokenSnap = await userRef.collection('fcmTokens').get();
    const tokens = Array.from(new Set(tokenSnap.docs.map(d => d.id)));

    if(!tokens.length) {
      return res.status(404).json({error: "Nessun token registrato"});
    }

    // Costruisco il messaggio
    const messaggio = {
      tokens,
      data: {
        title,
        body,
        url,
        type,
        actions
      }
    };

    // Invio la notifica a tutti i token dell'utente
    const resp = await admin.messaging().sendEachForMulticast(messaggio);

    res.json({
      ok: true,
      tokensBefore: tokens.length,
      sent: resp.successCount,
      failed: resp.failureCount
    });

  } catch(err) {
    console.error("Errore invio notifica: ", err);
    res.status(500).json({error: 'Errore invio notifica'});
  }
})

module.exports = router;