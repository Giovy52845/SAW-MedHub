const BASE_URL = "http://localhost:3000/api/notifiche";

export async function getVapidKey() {
    const res = await fetch(`${BASE_URL}/public-vapid-key`);

    if(!res.ok) throw new Error("Errore nel recupero della vapid key");

    return res.json();
}

export async function postTokenNotifiche(uid, ruolo, token) {
    const res = await fetch(`${BASE_URL}/register-token`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            uid,
            ruolo,
            token
        })
    })

    if(!res.ok) throw new Error("Errore nel post del token");

    return res.json();
}

export async function postUnregisterTokenNotifiche(uid, ruolo, token) {
    const res = await fetch(`${BASE_URL}/unregister-token`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            uid,
            ruolo,
            token
        })
    })

    if(!res.ok) throw new Error("Errore nell'unregister del token: ");

    return res.json();
}

export async function postInvioNotifica(message) {
    const res = await fetch(`${BASE_URL}/notify-send`, {
        method: "POST",
        headers: {"Content-Type" : "application/json" },
        body: JSON.stringify(message)
    })

    if(!res.ok) throw new Error("Errore nell'invio della notifica.");

    return res.json();
}