import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

import {
  getSanitarioData,
  getAppuntamento,
  getPazienteReferto,
  getPazienteRefertoModifica,
  putReferto,
} from "../../api/api";
import { storage } from "../../firebase/firebase";

import logo_navbar from "../../assets/img/navbar_logo_green.png";
import "./Referto.css";

import jsPDF from "jspdf";

export default function Referto() {
  const { idAppuntamento, idSan, idPaz } = useParams();
  const navigate = useNavigate();

  const [sanitario, setSanitario] = useState(null);
  const [nomeCognome, setNomeCognome] = useState("");
  const [dataNascita, setDataNascita] = useState("");
  const [luogoNascita, setLuogoNascita] = useState("");

  const [referto, setReferto] = useState("");

  const [appuntamento, setAppuntamento] = useState(null);
  const formDisabilitato =
    appuntamento?.stato === "refertato" || appuntamento?.stato === "attesa";

  const [paziente, setPaziente] = useState(null);

  // Recupero i dati del sanitario
  useEffect(() => {
    getSanitarioData(idSan)
      .then((data) => setSanitario(data))
      .catch((err) => console.error("Si è verificato un errore:", err));
  }, [idSan]);

  // Recupero l'appuntamento
  useEffect(() => {
    getAppuntamento(idAppuntamento)
      .then((data) => setAppuntamento(data))
      .catch((err) => console.error("Errore nell'appuntamento: ", err));
  }, [idAppuntamento]);

  // Recupero i dati del paziente
  useEffect(() => {
    getPazienteReferto(idSan, idPaz)
      .then((data) => setPaziente(data))
      .catch((error) => setPaziente(data));

    setNomeCognome(paziente?.nomeCognome);
  }, [idPaz]);

  // Eseguo dei controlli sull'apuntamento
  useEffect(() => {
    if (appuntamento?.stato === "cancellato") {
      navigate("/pazienti");
    }
  }, [appuntamento]);

  useEffect(() => {
    if (paziente?.nomeCognome) {
      setNomeCognome(paziente.nomeCognome);
    }
    if (paziente?.dataNascita) {
      setDataNascita(paziente.dataNascita);
    }
    if (paziente?.luogoNascita) {
      setLuogoNascita(paziente.luogoNascita);
    }
    if (appuntamento?.referto) {
      setReferto(appuntamento.referto);
    }
  }, [paziente, appuntamento]);

  function handleAnnulla() {
    setNomeCognome("");
    setDataNascita("");
    setLuogoNascita("");
    setReferto("");
  }

  async function handleSalva() {
    // Salvo i dati aggiornati del paziente
    getPazienteRefertoModifica(
      idSan,
      idPaz,
      nomeCognome,
      dataNascita,
      luogoNascita
    );

    // Creo il documento
    const documento = {
      nomeCognome,
      luogoNascita,
      dataNascita,
      esame:
        appuntamento?.prestazione ||
        "Prestazione non specificata in fase di prenotazione",
      referto,
      dataRefertazione: new Date(),
      refertatoDa: `${sanitario?.nome.toUpperCase()} ${sanitario?.cognome.toUpperCase()}`,
    };

    const pdf = generaRefertoPDF(documento);
    const nomeFile = `${idAppuntamento}`;

    try {
      // Carico il PDF su FireStorage
      const downloadURL = await uploadRefertoPDF(pdf, nomeFile);

      // Modifico l'appuntamento sul db
      const datiRef = {
        referto,
        refertoURL: downloadURL,
      };
      console.log("REF: ", datiRef.referto);
      console.log("LINK: ", datiRef.refertoURL);
      putReferto(idAppuntamento, datiRef);

      toast.success("Referto salvato correttamente.");
      window.location.reload();
    } catch (err) {
      console.error("Si è verificato un errore: ", err);
      toast.error("Si è verificato un errore nel salvataggio del referto.");
    }
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="referto-container">
          <div className="referto-logo">
            <img src={logo_navbar} alt="Logo MedHUB" />
            <button
              className="btn-chiudi"
              onClick={() => {
                handleAnnulla();
                navigate("/pazienti");
              }}
            >
              Chiudi
            </button>
          </div>
          {appuntamento?.stato !== "attesa" ? (
            <div className="referto-body">
              <div className="referto-dati-anagrafici">
                <h5>DATI ANAGRAFICI</h5>
                <div className="anagrafica-grid">
                  <p className="referto-p">Cognome e Nome</p>
                  <input
                    disabled={formDisabilitato}
                    placeholder={nomeCognome}
                    className="referto-input"
                    onChange={(e) => setNomeCognome(e.target.value)}
                  />

                  <p className="referto-p">Data di nascita</p>
                  <input
                    disabled={formDisabilitato}
                    placeholder={
                      dataNascita || "Inserisci la data di nascita..."
                    }
                    className="referto-input"
                    onChange={(e) => setDataNascita(e.target.value)}
                  />

                  <p className="referto-p">Luogo di nascita</p>
                  <input
                    disabled={formDisabilitato}
                    placeholder={
                      luogoNascita || "Inserisci il luogo di nascita..."
                    }
                    className="referto-input"
                    onChange={(e) => setLuogoNascita(e.target.value)}
                  />
                </div>
                <hr />
              </div>
              <div className="referto-dati-visita">
                <h5>PRESTAZIONE</h5>
                <div className="anagrafica-grid">
                  <p className="referto-p">Esame</p>
                  <input
                    disabled
                    placeholder={
                      appuntamento?.prestazione ||
                      "Prestazione non specificata in fase di prenotazione"
                    }
                    className="referto-input"
                  />
                </div>
                <hr />
              </div>
              <div className="referto">
                <p>Referto</p>
                <textarea
                  disabled={formDisabilitato}
                  placeholder={referto || "Scrivi..."}
                  onChange={(e) => setReferto(e.target.value)}
                ></textarea>
                <p className="mt-4">
                  Refertato da: {sanitario?.nome.toUpperCase()}{" "}
                  {sanitario?.cognome.toUpperCase()}
                </p>
              </div>
              {appuntamento?.stato !== "refertato" ? (
                <div className="referto-buttons">
                  <a
                    href={appuntamento?.refertoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-stampa"
                  >
                    🖨️ Stampa
                  </a>
                  <button className="btn-annulla" onClick={handleAnnulla}>
                    Annulla
                  </button>
                  <button className="btn-salva" onClick={handleSalva}>
                    Salva
                  </button>
                </div>
              ) : (
                <div className="stato-refertato">
                  <a
                    href={appuntamento?.refertoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-stampa"
                  >
                    🖨️ Stampa
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p>
              Non puoi scrivere il referto fino al giorno ${appuntamento?.data}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  function generaRefertoPDF(documento) {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("DATI ANAGRAFICI", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Nome e Cognome: ${documento.nomeCognome}`, 20, 35);
    doc.text(`Data di Nascita: ${documento.dataNascita}`, 20, 45);
    doc.text(`Luogo di Nascita: ${documento.luogoNascita}`, 20, 55);

    doc.line(10, 65, 200, 65);

    doc.setFontSize(16);
    doc.text("PRESTAZIONE", 105, 75, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Esame: ${documento.esame}`, 20, 90);

    doc.line(10, 100, 200, 100);

    doc.setFontSize(14);
    doc.text("Referto:", 20, 110);
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(documento.referto, 170), 20, 120);

    doc.text(
      `Data refertazione: ${documento.dataRefertazione.toLocaleDateString()}`,
      20,
      250
    );
    doc.text(`Refertato da: ${documento.refertatoDa}`, 20, 260);

    return doc;
  }

  async function uploadRefertoPDF(pdfDoc, nomeFile) {
    const pdfBlob = pdfDoc.output("blob");

    const storageRef = ref(storage, `referti/${nomeFile}`);

    await uploadBytes(storageRef, pdfBlob);

    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  }
}
