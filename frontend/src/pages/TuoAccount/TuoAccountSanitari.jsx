// ! IMPORT REACT E DI TERZE PARTI
import {useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdCard,
  faUserDoctor,
  faEuroSign,
  faStethoscope,
  faImage,
} from '@fortawesome/free-solid-svg-icons';

// ! import delle API
import { getSanitarioData, getSpecialistiche } from '../../api/api';

// ! import delle TABS
import InfoTab from './tabs/InfoTab';
import BioTab from './tabs/BioTab';
import VisiteTab from './tabs/VisiteTab';
import TariffeTab from './tabs/TariffeTab';
import ImmaginiTab from './tabs/ImmaginiTab';

// ! import DATI UTENTE CORRENTE e FIREBASE STORAGE
import { useAuth } from '../../AuthContext';

// ! import NAVBAR SANITARIO
import NavbarSanitario from '../../components/Navbar/NavbarSanitario'

// ! import CSS


export default function TuoAccountSanitario() {
    
    // ? Recupero i dati dell'utente corrente
    const { userData } = useAuth();

    // ? Variabile utilizzata per salvare i dati degli utenti
    const [userDataDB, setUserDataDB] = useState(null);
    const [specialistiche, setSpecialistiche] = useState(null);

    // ? Nome delle specialistica
    const specializzazioneNome = specialistiche
        ? specialistiche.find((item) => item.id === userDataDB?.specializzazione)?.nome || ""
        : "";


    // ? Variabili per la navigazione nelle tabs
    const tabConfig = [
        {
            key: "info",
            label: "Info Generali",
            icon: faIdCard,
            alert: {
            variant: "info",
            title: "Informazioni di base",
            message: "Queste informazioni identificano il tuo profilo."
            }
        },
        {
            key: "bio",
            label: "Bio & Specializzazione",
            icon: faUserDoctor,
            alert: {
            variant: "info",
            title: "Come scrivere una buona bio",
            message: "Descrivi la tua esperienza e specializzazione."
            }
        },
        {
            key: "tariffe",
            label: "Tariffe",
            icon: faEuroSign,
            alert: {
            variant: "warning",
            title: "Inserisci tariffe trasparenti",
            message: "Indica il costo per ogni tipo di visita."
            }
        },
        {
            key: "visite",
            label: "Modalità Visita",
            icon: faStethoscope,
            alert: {
            variant: "info",
            title: "Modalità di visita",
            message: "Studio, online o entrambi? Scegli come ricevi i pazienti."
            }
        },
        {
            key: "immagini",
            label: "Immagini",
            icon: faImage,
            alert: {
            variant: "secondary",
            title: "Carica immagini professionali",
            message: "Una foto profilo nitida trasmette fiducia."
            }
        }
    ];
    const [activeTab, setActiveTab] = useState("info");
    const currentTab = tabConfig.find(alert => alert.key === activeTab);

    // ? Aggiorna i dati quando l'uid cambia
    useEffect(() => {
        if(userData?.uid) {
            // Chiamata API per ottenere i dati del sanitario dal DB
            getSanitarioData(userData.uid)
                .then((data) => {
                    setUserDataDB(data);
                })
                .catch((err) => {
                    console.error("Errore nel caricamento dei dati del sanitario.");
                })
            // Chiamata API per ottenere le specialistiche salvate nel DB
            getSpecialistiche()
                .then((data) => {
                    setSpecialistiche(data);
                })
                .catch((err) => {
                    console.error("Errore nel caricamento delle specialistiche.");
                })
        }
    }, [userData?.uid]);

    const handleNotificheChange = async (enabled, token) => {
        // Aggiorna l'UI
        setUserDataDB(prev => ({ ...prev, notifiche: enabled }));
    };


    return (
        <div className="container-fluid">
            <div className='row'>
                <div className='col-md-2'>
                    <NavbarSanitario />
                </div>
                <div className='col-md-10'>
                    <div className='row'>
                        <div className='col-md-9 tabs-container__wrapper'>
                            {/* TABS PER LA NAVIGAZIONE*/}
                            <ul className='nav nav-tabs custom-tabs'>
                                {tabConfig.map(tab => (
                                    <li className='nav-item' key={tab.key}>
                                        <button
                                            className={`nav-link custom-tab-link ${activeTab === tab.key ? "active" : ""}`}
                                            onClick={() => setActiveTab(tab.key)}
                                        >
                                            <FontAwesomeIcon icon={tab.icon} className='me-2' />
                                            {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className='tab-content mt-4'>
                                { activeTab === "info" && 
                                    <InfoTab 
                                        nome={userDataDB?.nome.toUpperCase() || ""}    
                                        cognome={userDataDB?.cognome.toUpperCase() || ""}
                                        email={userDataDB?.email || ""}
                                        telefono={userDataDB?.telefono || ""}
                                        numero_ordine={userDataDB?.numero_ordine || ""}
                                        ordine_citta={userDataDB?.ordine_citta.toUpperCase() || ""}
                                        uid={userDataDB?.uid || ""}
                                        checked={userDataDB?.notifiche || false}
                                        onChange={handleNotificheChange}
                                    />
                                }
                                { activeTab === "bio" && 
                                    <BioTab 
                                        specializzazione={specializzazioneNome}
                                        uid={userData.uid}
                                    />
                                }
                                { activeTab === "tariffe" && 
                                    <TariffeTab 
                                        uid={userData.uid}
                                    />
                                }
                                { activeTab === "visite" && 
                                    <VisiteTab
                                        uid={userData.uid}
                                    />
                                }
                                { activeTab === "immagini" && 
                                    <ImmaginiTab
                                        uid={userData.uid}
                                    />
                                }
                            </div>
                        </div>
                        {/* ALERT LATERALI */}
                        <div className="col-md-3">
                            <div className={`alert alert-${currentTab.alert.variant} custom-allert`}>
                                <h6><FontAwesomeIcon icon={currentTab.icon} className="me-2" />{currentTab.alert.title}</h6>
                                <p>{currentTab.alert.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
)}