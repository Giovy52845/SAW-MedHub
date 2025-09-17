import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { auth } from "../../firebase/firebase"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


import './LoginForm.css'
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const navigate = useNavigate();
    
    const isFormValid = () => 
        (email.trim() !== '') &&
        (password.trim() !== '');
    
    function handleSubmitEmailPassword(email, password, setShowMessage) {
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            setShowMessage(false);
            navigate("/");
        }).catch((error) => {
            console.log("Errore Firebase:", error.code, error.message);
            if (
                error.code === 'auth/user-not-found' || 
                error.code === 'auth/wrong-password' ||
                error.code === 'auth/invalid-email'  ||
                error.code === 'auth/invalid-credential'
            ) {
                setShowMessage(true);
            }
        });
    }
    
    return (
        <div className="login-input">
            <input 
                type="email"
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
            />

            <div className="password-field-wrapper">
                <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password-icon"
                >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>

            </div>
                {showMessage &&
                    <p className='wrong-credentials'>Email o password errati.</p>
                }
            <div className="login-btn">
                <button
                    onClick={() => handleSubmitEmailPassword(email, password, setShowMessage)}
                    disabled={!isFormValid()}
                    className="submit-btn"
                >
                    Login
                </button>
            </div>

            <div className='login-forget-password'>
                <Link to="/remind-password">Hai dimenticato la password?</Link>
            </div>

            <div className='account-signup-wrapper'>
                <hr />
                <p>Non hai ancora un account? <Link to="/register-patient">Registrati</Link></p>
            </div>


        </div>
    );
}
