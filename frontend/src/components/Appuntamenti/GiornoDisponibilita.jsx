import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

import "./Appuntamenti.css"

export default function GiornoDisponibilita( {giorno, fasce = [], onChange} ) {
  
    const aggiungiFascia = () => {
        const nuovaFascia = { inizio: "", fine: "", tipo: "studio" };
        onChange([...fasce, nuovaFascia]);
    };

    const aggiornaFascia = (index, campo, valore) => {
        const nuoveFasce = [...fasce];
        nuoveFasce[index][campo] = valore;
        onChange(nuoveFasce);
    };

    const rimuoviFascia = (index) => {
        const nuoveFasce = fasce.filter((_, i) => i !== index);
        onChange(nuoveFasce);
    };

    return (
        <div className="card giorno-disponibilita__container">
            <div className="giorno-disponibilita__title">
                <h5>{giorno[0].toUpperCase() + giorno.slice(1)}</h5>
            </div>
            <div className="giorno-disponibilita__fasce">
                {fasce.map((fascia, i) => (
                    <div key={i} className="giorno-disponibilita__fascia-row">
                        <input
                            type="time"
                            value={fascia.inizio}
                            onChange={(e) => aggiornaFascia(i, "inizio", e.target.value)}
                        />
                        <input
                            type="time"
                            value={fascia.fine}
                            onChange={(e) => aggiornaFascia(i, "fine", e.target.value)}
                        />
                        <select
                            value={fascia.tipo}
                            onChange={(e)=> aggiornaFascia(i, "tipo", e.target.value)}
                        >
                            <option value="studio">In Studio</option>
                            <option value="online">Online</option>
                        </select>
                        <button onClick={() => rimuoviFascia(i)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                ))}
                <button onClick={aggiungiFascia} className="aggiungi-fascia-btn">
                    <FontAwesomeIcon icon={faPlus} />
                    Aggiungi fascia
                </button>                
            </div>
        </div>
    );
}