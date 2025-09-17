importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyABX_H8fY84MFdPHpj3fTvzPriOaV2eaqk",
  authDomain: "medhub-577e7.firebaseapp.com",
  projectId: "medhub-577e7",
  storageBucket: "medhub-577e7.firebasestorage.app",
  messagingSenderId: "996863374191",
  appId: "1:996863374191:web:6c36e0aaf16b05a5636e9a",
  measurementId: "G-JCH500JJN0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, url } = payload.data;
  const actions = payload.data?.actions ? JSON.parse(payload.data.actions) : [];

  self.registration.showNotification(title, {
    body,
    icon: '/icons/web-app-manifest-192x192.png',
    data: { url },
    actions,
  });
});

self.addEventListener('notificationclick', function(event) {
  const url = event.notification.data?.url;
  event.notification.close();
  
  // Se è statp premuto un pulsante con action
  if(event.action === 'open' && url) {
    event.waitUntil(clients.openWindow(url));
  }

  if(event.action === 'dismiss') {
    return;
  }

  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});