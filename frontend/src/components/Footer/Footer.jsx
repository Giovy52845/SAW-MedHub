import { Link } from 'react-router-dom';
import { useEffect } from 'react';

import './Footer.css'

export default function Footer() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h4>MedHUB</h4>
                    <p>Il tuo punto di riferimento per la salute.</p>
                </div>

                <div className="footer-links">
                    <div>
                        <h5>Servizi</h5>
                        <ul>
                            <li><Link to={"/domande-risposte"}>Chiedi al dottore</Link></li>
                            <li><a href="/prenota">Prenota una visita</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5>Account</h5>
                        <ul>
                            <li><a href="/login-page">Login</a></li>
                            <li><a href="/register-patient">Registrazione</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} MedHUB - Progetto universitario - By Giovanni D'Alessandro</p>
            </div>
        </footer>
    );
}