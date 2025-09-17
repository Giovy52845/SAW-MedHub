import { useState } from "react";
import "./ModuloPrenotazione.css"
import SlotDisponibile from "./SlotDisponibili";

export default function PrenotaStudio( {sanitario, uidPaz} ) {

    const [prestazioneSelezionata, setPrestazionSelezionata] = useState("");

    return (
        <div className="prenota-studio__container">
            <div className="prenota-studio__info">
                <div className="prenota-studio__indirizzo">
                    <h6>Indirizzo</h6>
                    <h5>{sanitario?.modalita_visita?.indirizzo} - {sanitario?.modalita_visita?.citta}</h5>
                </div>
                <div className="prenota-studio__prestazioni">
                    <h6>Prestazione</h6>
                    <select
                        value={prestazioneSelezionata}
                        onChange={(e) => setPrestazionSelezionata(e.target.value)}
                    >   
                        <option value=""></option>
                       {sanitario?.prestazioni.map((data, index) =>
                            data.nome !== "" ?
                                <option
                                    key={index}
                                    value={data.nome}
                                >{data.nome}</option>
                            : null
                        )} 
                    </select>
                </div>
            </div>
            <SlotDisponibile uidSan={sanitario?.uid} 
                             uidPaz={uidPaz}
                             prestazione={prestazioneSelezionata}
                             disponibilita={sanitario?.disponibilita}
                             tipo="studio"/>
        </div>
    );
}