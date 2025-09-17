// TextareaDomanda.jsx
import "./TextareaDomanda.css";

export default function TextareaDomanda({
  data,
  setData,
  handleBtn,
  ruolo = "paziente",
}) {
  const isPaziente = ruolo === "paziente";

  return (
    <div className="qa-message">
      <div className="row">
        {isPaziente && (
          <div className="col-md-6">
            <h4>Il tuo messaggio</h4>
          </div>
        )}

        <div className="col-12">
          <textarea
            className="qa-textarea"
            value={data ?? ""}
            placeholder={
              isPaziente
                ? "Scrivi la tua domanda qui. Per ragioni di sicurezza..."
                : "Scrivi qui la tua risposta per il paziente..."
            }
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        {isPaziente && (
            <div className="col-12 qa-li-rules">
              <ul>
                <li>La tua domanda sarà pubblicata in modo anonimo.</li>
                <li>Poni una domanda chiara, di argomento sanitario e sii conciso/a.</li>
                <li>La domanda sarà rivolta a tutti gli specialisti presenti su questo sito, non a un dottore in particolare.</li>
                <li>Questo servizio non sostituisce le cure mediche professionali...</li>
                <li>Non sono ammesse domande relative a casi dettagliati...</li>
                <li>Per ragioni mediche, non verranno pubblicate informazioni su dosi di medicinali.</li>
              </ul>
          </div>
        )}

        <div className="qa-button">
          <button onClick={handleBtn} className="qa-send-message">
            {isPaziente ? "Invia domanda" : "Invia risposta"}
          </button>
        </div>
      </div>
    </div>
  );
}
