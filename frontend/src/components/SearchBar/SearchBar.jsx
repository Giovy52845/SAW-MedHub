import './searchbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faVideo } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';

import InStudioInputs from './InStudioInputs';
import OnlineInputs from './OnlineInputs';

export default function SearchBar() {

    const [place, setPlace] = useState('studio');

    return (
        <div className='col-lg-9 input-container'>
            <div className='top-button'>
                <button className={`button-item ${place === "studio" ? "active" : ""}`} onClick={() => setPlace('studio')}>
                    <FontAwesomeIcon icon={faBuilding} className='me-2' />
                    In studio
                </button>
                <button className={`button-item ${place === "online" ? "active" : ""}`} onClick={() => setPlace('online')}>
                    <FontAwesomeIcon icon={faVideo} className='me-2' />
                    Online
                </button>
            </div>
            { place === 'studio' && <InStudioInputs />}
            { place === 'online' && <OnlineInputs />}
        </div>
    );
}