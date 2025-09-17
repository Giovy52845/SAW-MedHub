import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUsers, faGem} from '@fortawesome/free-solid-svg-icons';

import "./DoctorFeatures.css";

export default function DoctorFeatures() {
  return (
    <div className="col-lg-5 gradient-bg">
      <div className="container-grey">
        <div className="media">
          <div className="media-icon">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div className="media-body">
            <span>Unisciti anche tu a oltre 45'000 dottori soddisfatti</span>
            <span>
              Crea un account gratuito e scopri tutti gli strumenti per far
              crescere il tuo studio e risparmiare tempo!
            </span>
          </div>
        </div>
        <div className="media">
          <div className="media-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="media-body">
            <span>Raggiungi oltre 8 milioni di pazienti</span>
            <span>
              Promuovi i tuoi servizi e semplifica la comunicazione con i
              pazienti
            </span>
          </div>
        </div>
        <div className="media">
          <div className="media-icon">
            <FontAwesomeIcon icon={faGem} />
          </div>
          <div className="media-body">
            <span>Costruisci la tua reputazione sul web</span>
            <span>
              Crea un profilo professionale e distinguiti dagli altri
              specialisti della tua zona
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
