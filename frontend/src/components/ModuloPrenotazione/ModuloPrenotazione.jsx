import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faBuilding } from '@fortawesome/free-solid-svg-icons';


import { getSanitarioData } from "../../api/api"

import "./ModuloPrenotazione.css"
import PrenotaStudio from "./PrenotaStudio";
import PrenotaOnline from "./PrenotaOnline";

export default function ModuloPrenotazione({uidSan, uidPaz}) {
    
    const [sanitario, setSanitario] = useState(null);
    const [activeTab, setActiveTab] = useState("studio");

    useEffect(() => {
        getSanitarioData(uidSan)
            .then((data) => setSanitario(data))
            .catch((err) => console.error("Si è verificato un errore:", err));
    }, [uidSan]);


    return (
       <div className="modulo-prenotazione__wrapper">
            <div className={`modulo-prenotazione__header ${activeTab === 'online' ? "online" : ""}`}>
                <h4>Prenota una visita</h4>
            </div>
            <div className="modulo-prenotazione__body">
                <ul className="nav nav-tabs modulo-prenotazione__custom-tabs">
                    {sanitario?.modalita_visita.studio ?
                        <li className="nav-item" key="studio">
                            <button className={`nav-link modulo-prenotazione__custom-link ${activeTab === "studio" ? "active" : ""}`}
                                onClick={() => setActiveTab("studio")}
                            >   
                                <FontAwesomeIcon icon={faBuilding} />
                                Indirizzo
                            </button>
                        </li>
                    : ""
                    }
                    {sanitario?.modalita_visita.online ?
                        <li className="nav-item" key="online">
                            <button className={`nav-link modulo-prenotazione__custom-link ${activeTab === "online" ? "active" : ""}`}
                                onClick={() => setActiveTab("online")}
                            >   
                                <FontAwesomeIcon icon={faVideo} />
                                Online
                            </button>
                        </li>
                    : ""
                    }
                </ul>
            </div>
            <div className="modulo-prenotazione__info">
                { activeTab === "studio" &&
                    <PrenotaStudio sanitario={sanitario} uidPaz={uidPaz} />
                }
                { activeTab === "online" &&
                    <PrenotaOnline sanitario={sanitario} uidPaz={uidPaz} />
                }
            </div>
            <div className={`modulo-prenotazione__footer ${activeTab === "online" ? "online-footer" : ""}`}>
                <p>Nota: gli appuntamenti sono visibili di settimana in settimana</p>
            </div>
       </div> 
    )
}