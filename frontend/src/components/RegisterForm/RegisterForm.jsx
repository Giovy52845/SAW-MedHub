import { use, useState } from "react";
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faMinusCircle, faEye, faEyeSlash, faL } from '@fortawesome/free-solid-svg-icons';

import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification } from 'firebase/auth';
import { auth } from "../../firebase/firebase"

import "./RegisterForm.css"
import { text } from "@fortawesome/fontawesome-svg-core";

export default function RegisterForm() {
    const [showMessagePsw, setShowMessagePsw] = useState(false);
    const [showMessageEmail, setShowMessageEmail] = useState(false);
    
    const [email, setEmail] = useState('');
    const [confEmail, setConfEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [consentChecked, setConsentChecked] = useState(false)
    
    const passwordRequirements = [
        {
            label: "Minimo 8 caratteri",
            test: (val) => val.length >= 8
        },
        {
            label: "Almeno un carattere maiuscolo",
            test: (val) => /[A-Z]/.test(val)
        },
        {
            label: "Almeno un carattere minuscolo",
            test: (val) => /[a-z]/.test(val)
        },
        {
            label: "Almeno un numero",
            test: (val) => /\d/.test(val)
        }
    ];

    const navigate = useNavigate();

    const isFormValid = () =>
        (email.trim() !== "") &&
        (confEmail.trim() !== "") &&
        (passwordRequirements.every(req => req.test(password))) &&
        (consentChecked);


    function handleSubmitEmailPassword(email, confEmail, password, msgShow){    
        if(email !== confEmail){
            msgShow(true);
            return;
        } else {
            msgShow(false)
        }

        // Creo l'account con fireBase
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            
            // Funzione per creare il paziente:
            registerPatient(user);

            sendEmailVerification(user).then(() => {
                navigate("/")
            }).catch((error) => {
                console.error("Errore durante l'invio dell'email di verifica:", error.code, error.message);
            });

        }).catch((error) => {
            if(error.code === 'auth/email-already-in-use') {
                alert("L'email è già registrata. Effettua il login oppure usa un'altra email.");
            } else {
                alert("Si è verificato un errore nella registrazione. Riprova più tardi.");
                navigate("/");
            }
        })
    }

    async function registerPatient(user) {
        try {
            // Se la registrazione è andata a buon fine registro il paziente nel DB
            const res = await fetch("http://localhost:3000/api/pazienti", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email
                })
            });

            const result = await res.json();

            if(!result.success || !res.ok) {
                // Il salvataggio non è andato a buon fine e cancello l'utente
                await deleteUser(user);

                alert("Si è verificato un errore. Tornerai alla Homepage. (2) ");
                navigate("/");
                return;
            }

            // Torna alla Homepage (Successo)
            navigate("/");
        } catch (err) {
            // Si è verificato un errore quindi cancello l'utente.
            await deleteUser(user);
            
            alert("Si è verificato un errore. Tornerai alla Homepage. (1)");
            navigate("/");
        }
    }

    return (
        <div className="register-input">
            <input 
                type="email"
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
            />
            <input 
                type="email"
                placeholder="Conferma Email"
                value={confEmail}
                onChange={(e) => setConfEmail(e.target.value)}
                required
                />
            {showMessageEmail && 
                <p className="email-denied">Gli indirizzi email non corrispondono. Per favore, controlla di averli digitati correttamente.</p>
            }
            <div className="password-field-wrapper">
                <input 
                    type={showPassword ? "password" : "text"}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    onFocus={() => setShowMessagePsw(true)}
                    onBlur={() => setShowMessagePsw(false)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password-icon"
                >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
            </div>
            {showMessagePsw &&
                <div className="password-checker">
                    <p>Come creare una password sicura?</p>
                    <ul>
                        {passwordRequirements.map((req, idx) => {
                            const passed = req.test(password);
                            return (
                                <li key={idx} className={passed ? "psw-passed" : "psw-denied"}>
                                    <span>{passed ? <FontAwesomeIcon icon={faCheckCircle} />
                                            : <FontAwesomeIcon icon={faMinusCircle} />}
                                    </span>
                                    <span>{req.label}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            }

            <ul className="signup-checkbox-list">
                <li>
                    <label className="signup-checkbox-label">
                        <input
                            type="checkbox"
                            checked={consentChecked}
                            onChange={(e) => setConsentChecked(e.target.checked)}
                        />
                        <span>
                            Autorizzo MedHUB a processare i miei dati medici al fine di utilizzarne i servizi.
                        </span>
                    </label>
                </li>
            </ul>

            <div className="signup-btn">
                <button
                    onClick={() => handleSubmitEmailPassword(email, confEmail, password, setShowMessageEmail)}
                    disabled={!isFormValid()}
                    className="submit-btn"
                >
                    Registrati
                </button>
            </div>

            <div className="row">
                <div className="policy-wrapper col-6">
                    <hr />
                    <p className="policy">Registrandoti acconsenti ai nostri Termini e Condizioni e confermi di aver letto e compreso la nostra Privacy Policy.</p>
                </div>
            </div>
        </div>
    );
}
