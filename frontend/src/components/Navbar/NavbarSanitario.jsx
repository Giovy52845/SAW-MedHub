import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCalendarDays, faUsers, faCommentDots, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { getAuth, signOut } from 'firebase/auth';

import { Link, Navigate, useLocation } from 'react-router-dom'

import "./MyNavbar.css"
import logo from '../../assets/img/navbar_image.png'
import image_dashboard from '../../assets/img/sidebar-sanitario.png'

export default function NavbarSanitario() {

    const location = useLocation();

    return (
       <div className='sidebar-sanitario__wrapper'>
            <div className='sidebar-sanitario__logo'>
                <img src={logo}  alt="Logo MedHUB" />
            </div>
            <div className='sidebar-sanitario__ul-links'>
                <ul>
                    <li className={`sidebar-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
                        <Link to="/">
                            <FontAwesomeIcon icon={faCircle} />
                            Dashboard
                        </Link>
                    </li>
                    <li className={`sidebar-item ${location.pathname === "/sanitario/appuntamenti" ? "active" : ""}`}>
                        <Link to="/sanitario/appuntamenti">
                            <FontAwesomeIcon icon={faCalendarDays} />
                            Appuntamenti
                        </Link>
                    </li>
                    <li className={`sidebar-item ${location.pathname === "/pazienti" ? "active" : ""}`}>
                        <Link to="/pazienti">
                            <FontAwesomeIcon icon={faUsers} />
                            Pazienti
                        </Link>
                    </li>
                    <li className={`sidebar-item ${location.pathname === "/lista-domande" ? "active" : ""}`}>
                        <Link to="/lista-domande">
                            <FontAwesomeIcon icon={faCommentDots} />
                            Domande
                        </Link>
                    </li>
                    <li className={`sidebar-item ${location.pathname === "/tuo-account/impostazioni" ? "active" : ""}`}>
                        <Link to="/tuo-account/impostazioni">
                            <FontAwesomeIcon icon={faGear} />
                            Il tuo profilo
                        </Link>
                    </li>
                    <li className='sidebar-item'>
                        <Link to="/"
                            onClick={() => {
                                const auth =  getAuth();
                                signOut(auth)
                                .then(() => {
                                    <Navigate to="/" />
                                })
                                .catch((err) => {
                                    console.error("Errore durante il logout.", err);
                                })
                            }}
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>
            <div className='sidebar-sanitario__footer'>
                <img src={image_dashboard}  alt="Imagine Dashboard" />
            </div>
       </div>
    );
}