import { Link, useLocation } from 'react-router-dom';

import "./PazienteSettingsSidebar.css";

export default function PazienteSettingsSidebar() {
    const location = useLocation();
    return (
        <div className="tuo-account-paziente__settings-sidebar col-lg-3">
            <ul className="paziente-sidebar">
                <li className="paziente-sidebar-title">Specialisti</li>
                <li className={`paziente-sidebar-item ${location.pathname === '/tuo-account/lista-visite' ? 'active' : ''}`}>
                    <Link to={"/tuo-account/lista-visite"}>Le mie visite</Link>
                </li>
                <li className={`paziente-sidebar-item ${location.pathname === '/tuo-account/preferiti' ? 'active' : ''}`}>
                    <Link to={"/tuo-account/preferiti"}>Specialisti salvati</Link>
                </li>
                <li className="paziente-sidebar-divider"></li>
                <li className="paziente-sidebar-title">Comunicazione con i dottori</li>
                <li className={`paziente-sidebar-item ${location.pathname === '/tuo-account/domande' ? 'active' : ''}`}>
                    <Link to={"/tuo-account/domande"}>Domande pubbliche</Link>
                </li>
                <li className="paziente-sidebar-divider"></li>
                <li className="paziente-sidebar-title">Impostazioni dell'account </li>
                <li className={`paziente-sidebar-item ${location.pathname === '/tuo-account/impostazioni' ? 'active' : ''}`}>
                    <Link to={"/tuo-account/impostazioni"}>
                        Impostazioni dell'account
                    </Link>
                </li>
            </ul>
        </div>
    );
}
