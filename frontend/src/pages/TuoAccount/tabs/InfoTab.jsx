import NotificheButton from '../../../features/notifiche/NotificheButton'
import "./tabs.css";


export default function InfoTab({ nome, 
                                  cognome,
                                  email, 
                                  telefono, 
                                  numero_ordine, 
                                  ordine_citta, 
                                  uid,
                                  checked,
                                  onChange}) {
  return (
    <div className="tab-pane fade show active">
        <div className="sanitario-card__input row">
            <div className="col-lg-3 sanitario-card__label">
                <h4>Nome</h4>
            </div>
            <div className="col-lg-9 sanitario-card__field">
                <input
                    type="text"
                    placeholder={nome}
                    readOnly
                />
            </div>
      </div>
        <div className="sanitario-card__input row">
                <div className="col-lg-3 sanitario-card__label">
                    <h4>Cognome</h4>
                </div>
                <div className="col-lg-9 sanitario-card__field">
                    <input
                        type="text"
                        placeholder={cognome}
                        readOnly
                    />
                </div>
        </div>
        <div className="sanitario-card__input row">
                <div className="col-lg-3 sanitario-card__label">
                    <h4>Email</h4>
                </div>
                <div className="col-lg-9 sanitario-card__field">
                    <input 
                        type="text" 
                        placeholder={email} 
                        readOnly
                    />
                </div>
        </div>
        <div className="sanitario-card__input row">
                <div className="col-lg-3 sanitario-card__label">
                    <h4>Telefono</h4>
                </div>
                <div className="col-lg-9 sanitario-card__field">
                    <input
                        type="text"
                        placeholder={telefono}
                        readOnly
                    />
                </div>
        </div>
        <div className="sanitario-card__input row">
                <div className="col-lg-3 sanitario-card__label">
                    <h4>Numero Ordine</h4>
                </div>
                <div className="col-lg-9 sanitario-card__field">
                    <input
                        type="text"
                        placeholder={numero_ordine}
                        readOnly
                    />
                </div>
        </div>
        <div className="sanitario-card__input row">
                <div className="col-lg-3 sanitario-card__label">
                    <h4>Ordine d'iscrizione</h4>
                </div>
                <div className="col-lg-9 sanitario-card__field">
                    <input
                        type="text"
                        placeholder={ordine_citta}
                        readOnly
                    />
                </div>
        </div>
        <div className="sanitario-card__input row">
                <div className="col-lg-3 sanitario-card__label">
                    <h4>Abilita notifiche</h4>
                </div>
                <div className="col-lg-9 sanitario-card__field">
                    <NotificheButton 
                        uid={uid}
                        ruolo="sanitario"
                        initialChecked={checked}
                        onChange={onChange}
                    />
                </div>
        </div>
    </div>
  );
}
