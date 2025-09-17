import { useState } from "react";
import "./ModuloPrenotazione.css"
import SlotDisponibile from "./SlotDisponibili";

export default function PrenotaOnline( {sanitario, uidPaz} ) {

    return (
        <div className="prenota-online__container">
            <div className="prenota-studio__info">
                <div className="prenota-studio__indirizzo">
                    <h6>Indirizzo</h6>
                    <p>Scegli la piattaforma che più preferisci</p>
                </div>
                <div className="prenota-studio__prestazioni">
                    <h6>Prestazione</h6>
                    <p>Consulenza online</p>
                </div>
            </div>
            <SlotDisponibile uidSan={sanitario?.uid} 
                             uidPaz={uidPaz}
                             prestazione="Consulenza online"
                             disponibilita={sanitario?.disponibilita}
                             tipo="online"/>
        </div>
    );
}