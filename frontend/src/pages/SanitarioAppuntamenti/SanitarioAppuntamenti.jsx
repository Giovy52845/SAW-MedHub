import { useAuth } from "../../AuthContext";
import NavbarSanitario from "../../components/Navbar/NavbarSanitario";
import DisponibilitaSettimanale from "../../components/Appuntamenti/DisponibilitaSettimanale";
import ConfermaAppuntamenti from "../../components/Appuntamenti/ConfermaAppuntamenti";
import ListaAppuntamenti from "../../components/Appuntamenti/ListaAppuntamenti";

import "./SanitarioAppuntamenti.css";

export default function SanitarioAppuntamenti() {
  const { userData } = useAuth();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <NavbarSanitario />
        </div>
        <div className="col-md-10 sanitario-appuntamenti__container">
          <div className="row sanitario-appuntamenti__grid">
            <div className="col-md-7">
              <DisponibilitaSettimanale uid={userData?.uid} />
              <ListaAppuntamenti uid={userData?.uid} />
            </div>
            <div className="col-md-5">
              <ConfermaAppuntamenti uid={userData?.uid} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
