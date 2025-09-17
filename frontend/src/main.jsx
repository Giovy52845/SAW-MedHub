// Import di terze parti
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import AppRouter from './Router.jsx'
import AuthProvider from './AuthContext.jsx';

import { attachForegroundFCM } from './features/notifiche/notifications.js';

import './styles/global.css'

// Monta l'applicazione React all'interno dell'elemento con id="root"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*Fornisce il contesto di autentificazione a tutta l'app */}
    <AuthProvider>
      {/* Router principale che gestisce le varie pagine dell'app */}
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
);

// Controllo che il browser supporti i Service Worker
if ('serviceWorker' in navigator) {
  // Registro il service worker solo dopo che la pagina è stata caricata
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => {
        console.log('[SW] Registrato con scope:', reg.scope);
        
        // Associo la logica per ricevere notifiche FCM anche quando l'app è in foreground
        attachForegroundFCM();
      })
      .catch(err => {
        
        // Gestione errore in fase di registrazione
        console.error('[SW] Errore di registrazione:', err);
      });
 });
}