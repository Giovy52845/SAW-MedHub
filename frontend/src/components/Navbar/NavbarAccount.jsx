import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate  } from 'react-router-dom';

import logo_green from '../../assets/img/logo_green.png'

export default function NavbarAccount({ email }) {

    const navigate = useNavigate();

    return (
        <div className='navbar-account__container'>
            <div className='row'>
                <div className=' col-lg-2 navbar-account__img'>
                    <img src={logo_green} alt="Logo MedHUB" />
                </div>
                <div className='col-lg-8 navbar-account__info-account'>
                    <h3>Account</h3>
                    <h6>Email: {email}</h6>
                </div>
                <div className='col-lg-2 navbar-account__btn'>
                    <button onClick={() => navigate("/")}>
                        <FontAwesomeIcon icon={faXmark} />
                        Chiudi
                    </button>
                </div> 
            </div>
            <hr className='navbar-line' />
        </div>
    );
}