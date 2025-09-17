# SAW-MedHub

## Introduzione
SAW-MedHub è una piattaforma web per la gestione di appuntamenti e informazioni mediche, sviluppata come progetto per l'esame di "Sviluppo di applicazioni Web".  
Il sistema è ispirato a [**MioDottore**](https://www.miodottore.it) e ne riproduce le principali funzionalità: prenotazione di visite, gestione dei profili medici e comunicazione tra pazienti e specialisti.
Il progetto è composto da un frontend (Vite + React) e un backend Node.js/Express.

## Requisiti 
 - **Git** (Windows/macOS/Linux)
 - **Node.js LTS** (18 o 20)
 - Browser moderno (Chrome/Edge/Brave/Firefox)

### Installare Node + npm
Node.js è necessario per eseguire il backend e gestire le dipendenze tramite npm (che viene installato automaticamente con Node.js).  
Si consiglia di utilizzare la versione LTS (≥ 18).

### Clonare il progetto
Per ottenere una copia locale del repository, esegui:
 ```git
    git clone https://github.com/Giovy52845/SAW-MedHub.git
    cd SAW-MedHub
 ```

### Configurazione variabili d'ambiente
Inserire nella cartella `backend/` il file **.env** con i seguenti campi:
 - `FIREBASE_PROJECT_ID`
 - `FIREBASE_CLIENT_EMAIL`
 - `FIREBASE_PRIVATE_KEY`
 - `FIREBASE_VAPID_PUBLIC_KEY`
Inserire nella cartella `frontend/` il file **.env** con i seguenti campi:
 - `FIREBASE_API_KEY`
 - `FIREBASE_AUTH_DOMAIN`
 - `FIREBASE_PROJECT_ID`
 - `FIREBASE_STORAGE_BUCKET`
 - `FIREBASE_MESSAGING_SENDER_ID`
 - `FIREBASE_APP_ID`
 - `FIREBASE_MESUREMENT_ID`
Il file `.env` non è incluso nel repository per motivi di sicurezza.

### Installazione dipendenze
Dare i permessi di esecuzione e installare le dipendenze
 - (Linux/macOS/Windows con GitBash)
 ```bash
    chmod +x ./install.sh
    ./install.sh
 ```

### Avvio
Dare i permessi di esecuzione e avviare facendo:
 ```bash
    chmod +x ./start.sh
    ./start.sh
 ```

## URL di default
 - **Frontend (Vite preview)**: http://localhost:4173
 - **Backend**: http://localhost:3000

---

## Come usare l'app

### Utente non autenticato
Dalla Homepage principale è possibile:
 - Cercare i sanitari per **nome** o **specialistica**.
 - Visualizzare le **domande pubbliche** poste dai pazienti.

### Utente autenticato
Accedendo con un account demo le funzionalità cambiano in base al ruolo.

#### Paziente
- Cercare uno specialista nel catalogo e visualizzarne il profilo.
- Salvare uno specialista tra i **preferiti**
- Scegliere uno **slot orario** settimanale e prenotare una visita.
- Lasciare una **recensione** (se l'appuntamento è stato confermato, la recensione viene *verificata*).
- Gestire le **impostazioni personali**:
 - Abilitare le **notifiche**.
 - Consultare le visite prenotate.
 - Visualizzare i **referti** una volta caricati dal medico.

#### Sanitario
- **Appuntamenti**: Definire la disponibilità impostando orario di inizio/fine -> il sistema genera slot da 60 minuti. Confermare o annullare gli appuntamenti.
- **Pazienti**: quando un appuntamento viene confermato, il paziente appare automaticamente in lista. Da qui il sanitario può redigere e caricare il **referto**.
- **Domande**: consultare le domande poste dai pazienti e rispondere.
- **Profilo personale**: modificare le proprie impostazioni e i dati del profilo.

#### Notifiche

Le notifiche sono inviate dopo consenso esplicito dell'utente nelle Impostazioni personali -> Notifiche.

Gli eventi che attivano le notifiche sono:
- **Conferma/Cancellazione appuntamento**: Quando un sanitario conferma un appuntamento il paziente riceve una notifica.
- **Risposta ad una domanda**: Quando un sanitario risponde ad una domanda il paziente riceve una notifica.
---