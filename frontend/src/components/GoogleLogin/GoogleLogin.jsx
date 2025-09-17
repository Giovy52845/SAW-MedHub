import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useNavigate } from 'react-router-dom'

import { auth } from "../../firebase/firebase"

import './GoogleLogin.css'

export default function GoogleLogin(){

    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();

    function handleGoogleAuth() {
        provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            navigate("/");
        })
        .catch((error) => {
            console.error("Errore Google Login:", error);
        });
    }

    return (
            <div className='oauth2-container'>
                <button 
                    className='google-btn'
                    onClick={() => handleGoogleAuth()}
                >
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Logo Google" />
                    <span>Continua con Google</span>
            </button>
        </div>
    );
}