import NavbarSanitario from "../../components/Navbar/NavbarSanitario";

import { useAuth } from "../../AuthContext";

import ProfiloWidget from "./widget/ProfiloWidget";
import PazientiWidget from "./widget/PazientiWidget";
import DomandePazientiWidget from "./widget/DomandePazientiWidget";
import AppuntamentiWidget from "./widget/AppuntamentiWidget";

import "./DashboardSanitario.css";

export default function DashboardSanitario() {
  const { userData } = useAuth();

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <NavbarSanitario />
          </div>
          <div className="col-md-10 sanitario-widget__container">
            <div className="row sanitario-appuntamenti__grid">
              <div className="col-md-6">
                <ProfiloWidget uid={userData?.uid} />
              </div>
              <div className="col-md-6">
                <AppuntamentiWidget uid={userData?.uid} />
              </div>
              <div className="col-md-6">
                <DomandePazientiWidget uid={userData?.uid} />
              </div>
              <div className="col-md-6">
                <PazientiWidget uid={userData?.uid} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
