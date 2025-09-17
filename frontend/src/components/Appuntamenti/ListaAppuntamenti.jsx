import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCalendar,
            faThumbtack,
            faCalendarAlt,
            faClock,
            faHospital,
            faComputer,
            faPen }from '@fortawesome/free-solid-svg-icons';

import { db } from '../../firebase/firebase';
import { ascoltaAppuntamenti} from '../../api/api';
import "./Appuntamenti.css"


export default function ListaAppuntamenti( {uid} ) {

    const [appuntamentiConfermati, setAppuntamentiConfermati] = useState([]);
    
    const appuntamentiFuturi = appuntamentiConfermati.filter(app => {
        const inizio = new Date(app.timestamp.seconds * 1000);
        return inizio >= new Date();
    }).sort((a, b) => {
        const dataA = new Date(a.timestamp.seconds * 1000);
        const dataB = new Date(b.timestamp.seconds * 1000);
        return dataA - dataB;
    })


    // Recupero gli appuntamenti confermati
    useEffect(() => {
        if(!uid) return;

        const unsubscribe = ascoltaAppuntamenti(uid, "confermato", setAppuntamentiConfermati);

        return() => unsubscribe();
        
    }, [uid])

    return(
        <div className="lista-appuntamenti__container">
            <div className="lista-appuntamenti__header">
                <FontAwesomeIcon icon={faCalendar} style={{color: "#4A90E2" }}/>
                <h3>Appuntamenti in programma</h3>
            </div>
            <div className='lista-appuntamenti__body'>
                {
                    appuntamentiFuturi.length === 0 ? (
                        <div className='no-appuntamenti'>
                            <p>🎉 Nessun appuntamento in attesa!</p>
                            <small>Goditi la giornata.</small>                            
                        </div>
                    ) : (
                        appuntamentiFuturi.map((app, index) => (
                            <div key={index} className='appuntamenti-futuri__card'>
                                <div className='appuntamenti-nome'>
                                    <FontAwesomeIcon className="appuntamenti-icon" icon={faThumbtack} style={{ color: '#2E8B57' }}/>
                                    <p className='appuntamenti-text'>
                                        {app.nomeCognomePAZ || "Nome e Cognome non disponibili"}
                                    </p>
                                </div>
                                <div className='appuntamenti-data-info'>
                                    <div className='appuntamenti-data'>
                                        <FontAwesomeIcon className="appuntamenti-icon" icon={faCalendarAlt} style={{ color: '#1E90FF' }}/>
                                        <p className='appuntamenti-text'>
                                            {new Intl.DateTimeFormat('it-IT').format(new Date(app.data))} |
                                        </p>
                                    </div>
                                    <div className='appuntamenti-clock'>
                                        <FontAwesomeIcon className="appuntamenti-icon" icon={faClock} style={{ color: '#8A2BE2' }}/>
                                        <p className='appuntamenti-text'>
                                            {app.hInizio} |
                                        </p>
                                    </div>
                                    {
                                        app.tipo === "studio" ? (
                                            <div className='appuntamenti-tipo'>
                                                <FontAwesomeIcon className="appuntamenti-icon" icon={faHospital} style={{ color: '#FF8C00' }} />
                                                <p className='appuntamenti-text'>
                                                    Studio
                                                </p>
                                            </div>
                                        ) : (
                                            <div className='appuntamenti-tipo'>
                                                <FontAwesomeIcon className="appuntamenti-icon" icon={faComputer} style={{ color: '#007BFF' }}/>
                                                <p className='appuntamenti-text'>
                                                    Online
                                                </p>
                                            </div>
                                        )
                                    }
                                    </div>
                                    <div className='appuntamenti-confermati-prestazione'>
                                        <FontAwesomeIcon className="appuntamenti-icon" icon={faPen} style={{ color: '#555555' }}/>
                                        <p className='appuntamenti-text'>
                                            {app?.prestazioni || "Prestazione non selezionata"}
                                        </p>
                                    </div>
                                <div className="appuntamenti-confermati__footer">
                                    <hr />
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );
}