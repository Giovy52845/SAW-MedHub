import { useState } from "react";
import "./SignInDoc1.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SignInDoc1() {

    const [specializzazione, setSpecializzazione] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const [specialistiche, setSpecialistiche] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3000/api/specialistiche")
            .then(res => res.json())
            .then(data => {
                setSpecialistiche(data);
                setLoading(false);
            }).catch(err => {
                console.error("Errore nel caricamento delle specialistiche:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Caricamento specialistiche...</p>

    function isValid(){
        return (
            (specializzazione !== "") &&
            (name.trim() !== "") &&
            (surname.trim() !== "")
        );
    }
    
    function handleStep1Submit(specializzazione, name, surname){
        const datiStep1 = {
            name: name.trim(),
            surname: surname.trim(),
            specializzazione: specializzazione
        }

        navigate("/register-doctor/doctor-profile", {
            state: {
                ...datiStep1,
                step1Completed: true
            }
        });
    }

    return (
        <div className="col-lg-7">
            <div className="container-white">
                <div className="register-doc-header">
                    <h2>Registrati come
                        <br />
                        Medico specialista / Medico di famiglia
                    </h2>
                </div>
                <div className="register-doctor__form-container">
                    <div className="register-doctor__select-spec">
                        <div className="select-spec__text">
                            <h6>Specializzazione*</h6>
                        </div>
                        <select className="select-spec" onChange={(e) => setSpecializzazione(e.target.value)}>
                            <option value="">Scegli...</option>
                            {specialistiche.map((item) =>(
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="register-doctor__field-group">
                        <div className="register-doctor__field-nome">
                            <h6>Nome*</h6>
                            <input type="text" onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="register-doctor__field-cognome">
                            <h6>Cognome*</h6>
                            <input type="text" onChange={(e) => setSurname(e.target.value)}/>
                        </div>
                    </div>
                    <div className="register-doctor__next-step">
                        <button disabled={!isValid()} onClick={() => handleStep1Submit(specializzazione, name, surname)}>Prossimo passo</button>
                    </div>
                    <div className="register-doctor__footer-text">
                        <p>* Campo obbligatorio</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
