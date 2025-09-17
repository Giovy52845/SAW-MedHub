// ! Import REACT e di terze parti
import { useRef, useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";

// ! Import FireStorage
import { storage } from "../../../firebase/firebase";

// ! Import API
import { getSanitarioData, putSanitarioProfilePicture } from "../../../api/api"

import "./tabs.css";

export default function ImmaginiTab({ uid }) {

    const [userData, setUserData] = useState(null);
    const fileInputRef = useRef(null);

    
    useEffect(() =>{
        if(uid){
            getSanitarioData(uid)
                .then((data) => {
                    setUserData(data);
                })
                .catch((err) => {
                    console.error("Si è verificato un errore nel recupero dei dati.", err);
                })
        }
    }, [uid])

    const handleUploadFotoProfilo = async (e) => {
        const file = e.target.files[0];
        const uid = userData.uid;

        if(!file || !uid) return;
        try {
            // ? Carico l'immagine su FireStorage
            const storageRef = ref(storage, `immagini_profilo/${userData.uid}/profilo.jpg`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // ? Chiamata API per salvare l'url dell'immagine sul DB
            const res = await putSanitarioProfilePicture(uid, downloadURL);

            const updatedData = await getSanitarioData(uid);
            setUserData(updatedData);

            toast.success("Foto profilo aggiornata con successo.");
        } catch (err) {
            console.error("Si è verificato un errore:", err);
            toast.error("Si è verificato un errore nel salvataggio dei dati.");
        }
    }

    return (
        <div className="tab-pane fade show active">
            <div className="row">
                <div className="col-md-4 img-profile__wrapper">
                    <div className="img-profile__photo">
                        <img
                            src={userData?.fotoProfiloURL}
                            alt="Immagine profilo"
                            className="img-profile"
                        />
                    </div>
                    <div className="img-profile__btn">
                        <button onClick={() => fileInputRef.current.click()}>
                            <FontAwesomeIcon icon={faPen} />
                            Modifica immagine
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleUploadFotoProfilo}
                            style={{ display: "none" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
