import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt,
         faUser,
         faClock,
         faCheckCircle,
         faHourglassHalf,
         faTimesCircle,
         faCheckSquare,
         faList,
         faPlus, 
         faCalendarDays}from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect } from 'react';

import { ascoltaAppuntamenti } from '../../../api/api';
         
import './widget.css'


export default function AppuntamentiWidget( {uid} ) {

    const [appConf, setAppConf] = useState([]);
    const [appAtt, setAppAtt] = useState([]);
    const [appCanc, setAppCanc] = useState([]);
    
    const appFuturi = appConf.filter(app => {
        const inizio = new Date(app.timestamp.seconds * 1000);
        return inizio >= new Date();
    }).sort((a, b) => {
        const dataA = new Date(a.timestamp.seconds * 1000);
        const dataB = new Date(b.timestamp.seconds * 1000);
        return dataA - dataB;
    })

    useEffect(() => {
      if (!uid) return;

      const unsubscribe1 = ascoltaAppuntamenti(uid, "confermato", setAppConf);
      const unsubscribe2 = ascoltaAppuntamenti(uid, "attesa", setAppAtt);
      const unsubscribe3 = ascoltaAppuntamenti(uid, "cancellato", setAppCanc);

      return () => {
          unsubscribe1();
          unsubscribe2();
          unsubscribe3();
      };
    }, [uid]);


  return (
    <div className="sanitario-widget__box">
      <div className="prossimi-appuntamenti">
        <h3>Prossimi appuntamenti</h3>
        {appFuturi.length === 0 ? (
          <p className="nessun-appuntamento">🎉 Nessun appuntamento in programma.</p>
        ) : (
          <div className="appuntamenti-info">
            <span>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ color: "#4A90E2" }} />{' '}
              {new Intl.DateTimeFormat('it-IT').format(new Date(appFuturi[0].data))}
            </span>
            <span>
              <FontAwesomeIcon icon={faClock} style={{ color: "#F5A623" }} /> {appFuturi[0].hInizio}
            </span>
            <span>
              <FontAwesomeIcon icon={faUser} style={{ color: "#7ED321" }} /> {appFuturi[0].nomeCognomePAZ}
            </span>
          </div>
        )}
      </div>

      <div className="riepilogo-stato">
        <h4>Riepilogo Stato</h4>
        <ul className="stato-list">
          <li><span className="circle green" /> Confermati: {appConf.length}</li>
          <li><span className="circle yellow" /> In attesa: {appAtt.length}</li>
          <li><span className="circle red" /> Cancellati: {appCanc.length}</li>
        </ul>
      </div>
    </div>
  );
}