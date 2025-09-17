import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";

import { useAuth } from "../../AuthContext";
import {
  postAppuntamento,
  getPaziente,
  ascoltaAppuntamenti,
} from "../../api/api";
import "./ModuloPrenotazione.css";

import { db } from "../../firebase/firebase";

function suddividiInSlot(disponibilita, durataSlotMinuti = 60) {
  const slot = {};

  for (const giorno in disponibilita) {
    slot[giorno] = [];

    disponibilita[giorno].forEach(({ inizio, fine, tipo }) => {
      const [hInizio, mInizio] = inizio.split(":").map(Number);
      const [hFine, mFine] = fine.split(":").map(Number);

      let startMinutes = hInizio * 60 + mInizio;
      const endMinutes = hFine * 60 + mFine;

      while (startMinutes + durataSlotMinuti <= endMinutes) {
        const slotStart = formattaOrario(startMinutes);
        const slotEnd = formattaOrario(startMinutes + durataSlotMinuti);
        slot[giorno].push({ inizio: slotStart, fine: slotEnd, tipo });
        startMinutes += durataSlotMinuti;
      }
    });
  }

  return slot;
}

function formattaOrario(minutiTotali) {
  const ore = Math.floor(minutiTotali / 60);
  const minuti = minutiTotali % 60;
  return `${ore.toString().padStart(2, "0")}:${minuti
    .toString()
    .padStart(2, "0")}`;
}

function formatDataLocale(data) {
  const yyyy = data.getFullYear();
  const mm = String(data.getMonth() + 1).padStart(2, "0");
  const dd = String(data.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function generaSettimanaConSlot(
  disponibilita,
  appuntamentiOccupati = [],
  durataSlotMinuti = 60
) {
  const oggi = new Date();
  const risultato = [];

  const slotSettimana = suddividiInSlot(disponibilita, durataSlotMinuti);

  for (let i = 0; i < 7; i++) {
    const data = new Date();
    data.setDate(oggi.getDate() + i);

    const dataISO = formatDataLocale(data);

    const nomeGiorno = data.toLocaleDateString("it-IT", { weekday: "long" });
    const giornoSettimana = nomeGiorno.toLowerCase();

    const label = data.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
    });

    const slotGiorno = slotSettimana[giornoSettimana] || [];

    const slotConOccupazione = slotGiorno.map((slot) => {
      const isOccupied = appuntamentiOccupati.some(
        (app) =>
          app.data === dataISO &&
          app.hInizio === slot.inizio &&
          app.hFine === slot.fine &&
          app.tipo === slot.tipo &&
          (app.stato === "confermato" || app.stato === "attesa")
      );

      return { ...slot, occupato: isOccupied };
    });

    risultato.push({
      data: dataISO,
      giorno: giornoSettimana,
      label,
      slot: slotConOccupazione,
    });
  }

  return risultato;
}

export default function SlotDisponibile({
  uidSan,
  uidPaz,
  prestazione,
  disponibilita,
  tipo,
}) {
  const { userData } = useAuth();

  const [appuntamentiOccupati, setAppuntamentiOccupati] = useState([]);

  const settimana = generaSettimanaConSlot(disponibilita, appuntamentiOccupati);
  const [espanso, setEspanso] = useState(false);

  const [profiloUtente, setProfiloUtente] = useState(null);

  const [bloccoPrenotazioni, setBloccoPrenotazioni] = useState(false);

  // Recupero gli appuntamenti
  useEffect(() => {
    if (!uidSan) return;

    const unsubscribe = ascoltaAppuntamenti(
      uidSan,
      null,
      setAppuntamentiOccupati
    );

    return () => unsubscribe();
  }, [uidSan]);

  // Recupero i dati del paziente
  useEffect(() => {
    if (!uidPaz) return;

    getPaziente(uidPaz)
      .then((data) => setProfiloUtente(data))
      .catch((err) => console.error("Si è verificato un errore: ", err));
  }, [uidPaz]);

  // Blocco l'utente dal prenotare altre visite se prima non viene confermata/cancellata la visita prenotata
  useEffect(() => {
    if (!appuntamentiOccupati || appuntamentiOccupati.length === 0) return;

    const appUtente = appuntamentiOccupati.find((a) => a.idPaz === uidPaz);

    if (!appUtente) return;

    if (appUtente.stato === "cancellato") {
      toast.info("L'appuntamento è stato cancellato.");
      setBloccoPrenotazioni(false);
    } else if (appUtente.stato === "attesa") {
      setBloccoPrenotazioni(true);
    } else if (appUtente.stato === "confermato") {
      setBloccoPrenotazioni(false);
      toast.info("L'appuntamento è stato confermato.");
    }
  }, [appuntamentiOccupati, uidPaz]);

  // ! Funzione che salva un appuntamento sul db
  async function handleSlotClick({ data, giorno, inizio, fine, tipo }) {
    // Per prenotare l'utente deve essere registrato
    if (!userData?.uid) {
      toast.warning(
        "Attenzione! Prima di prenotare un appuntamento devi effettuare il login."
      );
      return;
    }

    if (bloccoPrenotazioni) {
      toast.warning(
        "Prima di prenotare un altro appuntamento, aspetta che questo venga confermato o cancellato."
      );
      return;
    }

    const isoString = `${data}T${inizio}:00`;
    const timestamp = Timestamp.fromDate(new Date(isoString));

    const nome = profiloUtente?.nome || "";
    const cognome = profiloUtente?.cognome || "";
    const nomeCognomePAZ = `${nome} ${cognome}`;

    const appuntamento = {
      idSan: uidSan,
      idPaz: uidPaz,
      nomeCognomePAZ,
      email: profiloUtente?.email || "Non disponibile",
      data,
      giorno,
      hInizio: inizio,
      hFine: fine,
      tipo,
      prestazione,
      stato: "attesa",
      timestamp,
    };
    try {
      const res = await postAppuntamento(appuntamento);
      setBloccoPrenotazioni(true);
      toast.success("Richiesta di appuntamento inviata con successo.");
    } catch (err) {
      console.error("Errore prenotazione:", err);
      toast.error("Si è verificato un errore nella richiesta di appuntamento.");
    }
  }

  return (
    <div className="slot-disponibili__slider-wrapper">
      <div className="slot-disponibili__slider-container">
        <div className="slot-disponibili__slider">
          {settimana
            .filter((giorno) =>
              giorno.slot.some(
                (slot) =>
                  slot.tipo?.trim().toLowerCase() === tipo.trim().toLowerCase()
              )
            )
            .map(({ data, giorno, label, slot }) => (
              <div key={data} className="slot-disponibili__giorno-colonna">
                <div className="slot-disponibili__giorno-intestazione">
                  <strong>{etichettaGiorno(data)}</strong>
                  <br />
                  <span>{label}</span>
                </div>
                <div
                  className={`slot-disponibile__lista-slot ${
                    espanso ? "espanso" : ""
                  }`}
                >
                  {slot.filter(
                    (s) =>
                      s.tipo?.trim().toLowerCase() === tipo.trim().toLowerCase()
                  ).length === 0 ? (
                    <span>-</span>
                  ) : (
                    slot
                      .filter(
                        (s) =>
                          s.tipo?.trim().toLowerCase() ===
                          tipo.trim().toLowerCase()
                      )
                      .map((s, idx) => (
                        <button
                          key={idx}
                          disabled={s.occupato}
                          className={`slot-btn ${
                            s.occupato ? "occupato" : ""
                          } ${tipo === "online" ? "online-btn" : ""}`}
                          onClick={() =>
                            handleSlotClick({
                              data,
                              giorno,
                              inizio: s.inizio,
                              fine: s.fine,
                              tipo: s.tipo,
                            })
                          }
                        >
                          {s.inizio}
                        </button>
                      ))
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="slot-disponibile__mostra">
        <button onClick={() => setEspanso(!espanso)} className="toggle-btn">
          {espanso ? "Mostra meno" : "Mostra di più"}
        </button>
      </div>
    </div>
  );

  // Utility per "Oggi", "Domani", ecc.
  function etichettaGiorno(dataString) {
    const oggi = new Date();
    const domani = new Date();
    domani.setDate(oggi.getDate() + 1);

    const data = new Date(dataString);

    const stessoGiorno = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (stessoGiorno(data, oggi)) return "Oggi";
    if (stessoGiorno(data, domani)) return "Domani";

    return data.toLocaleDateString("it-IT", { weekday: "short" }); // es. "Ven"
  }
}
