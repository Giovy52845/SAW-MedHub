import { getMessagingIfSupported } from "../../firebase/firebase";
import { getToken, getMessaging, onMessage, isSupported } from "firebase/messaging";
import { getVapidKey } from "../../api/notifiche";

// FLAG USATO PER POTER LAVORARE IN npm run dev
const ENABLE_NOTIFICATIONS = true;

export async function requestNotificationPermissionAndToken() {
  if(!ENABLE_NOTIFICATIONS) {
    console.warn("Notifiche disabilitate (flag ENABLE_NOTIFICATIONS = false)");
    return null;
  }
  try {
    const permission = await Notification.requestPermission();
    console.log('[FCM] permission:', Notification.permission);

    if (permission !== "granted") {
      console.warn("Permesso per le notifiche non concesso.");
      return null;
    }

    const messaging = await getMessagingIfSupported();
    if (!messaging) {
      console.warn("Firebase Messaging non disponibile");
      return null;
    }

    const { vapidKey } = await getVapidKey();
    console.log('[FCM] vapid len:', vapidKey?.length, 'startsWithB:', vapidKey?.startsWith('B'));

    const token = await getToken(messaging, {
      vapidKey: vapidKey.trim(),
    });

    return token;
  } catch (error) {

    console.error("Errore durante la richiesta token:", error);
    return null;
  }
}

export function attachForegroundFCM() {
  if (window.__fcmFgAttached) return;
  window.__fcmFgAttached = true;

  isSupported().then(ok => {
    if (!ok) return;
    const messaging = getMessaging();

    onMessage(messaging, (payload) => {
      console.log("[FCM] foreground:", payload);

      // prendi i campi dalle data (data-only)
      const d = payload.data || {};
      const title = d.title || "MedHUB";
      const body  = d.body  || "";
      const url   = d.url   || "/";

      if (Notification.permission === "granted") {
        const n = new Notification(title, {
          body,
          icon: "/icons/web-app-manifest-192x192.png",
          data: { url },
        });
        n.onclick = () => { window.focus(); if (url) location.assign(url); };
      } else {
        // fallback
        alert(`${title}\n${body}`);
      }
    });
  });
}