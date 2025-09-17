/**
 * AppRouter
 *  - Definisce l'albero delle route dell'app
 *  - Applica gating minimo in base allo stato auth e al ruolo
 *  - Mostra toast globali 
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { useAuth } from "./AuthContext.jsx"

import HomePage from "./pages/HomePage/HomePage.jsx"
import PatientData from "./pages/PatientData/PatientData.jsx";
import QuestionAnswer from "./pages/DomandeRisposte/QuestionAnswer.jsx";
import RegisterPatient from "./pages/RegisterPatientPage/RegisterPatient.jsx";
import RegisterDoctor from "./pages/RegisterDoctorPage/RegisterDoctor.jsx";
import RegisterProfileDoctor from "./pages/RegisterProfileDoctor/RegisterProfileDoctor.jsx"
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RemindPassword from "./pages/RemindPassword/RemindPassword.jsx"
import DashboardSanitario from "./pages/DashboardSanitario/DashboardSanitario.jsx";
import TuoAccount from "./pages/TuoAccount/TuoAccount.jsx"
import ProfiloSanitario from "./pages/ProfiloSanitario/ProfiloSanitario.jsx";
import SanitariPreferiti from "./pages/SanitariPreferiti/SanitariPreferiti.jsx";
import SanitarioAppuntamenti from "./pages/SanitarioAppuntamenti/SanitarioAppuntamenti.jsx";
import ListaVisita from "./pages/ListaVisite/ListaVisita.jsx";
import ListaPazienti from "./pages/ListaPazienti/ListaPazienti.jsx";
import Referto from "./pages/Referto/Referto.jsx";
import CreaRecensione from "./pages/CreaRecensione/CreaRecensione.jsx";
import DomandaSingola from "./pages/DomandaSingola/DomandaSingola.jsx";
import DomandeSanitario from "./pages/DomandeSanitario/DomandeSanitario.jsx";
import DomandePaziente from "./pages/DomandePaziente/DomandePaziente.jsx";
import CercaPage from "./pages/CercaPage/CercaPage.jsx";

export default function AppRouter() {
  const { userData, loading } = useAuth();

  // Evita di montare il router finchè non conosciamo lo stato auth
  if (loading) return <p>Caricamento...</p>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Visibili a tutti */}
        <Route path="/" element={<HomePage />} />
        <Route path="/gdpr/patient-data" element={<PatientData />} />
        <Route path="/domande-risposte" element={<QuestionAnswer />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/remind-password" element={<RemindPassword />} />
        <Route path="/domande-risposte/:idDomanda" element={<DomandaSingola />} /> 
        <Route path="/cerca" element={<CercaPage />} />

        {/* Registrazione iniziale */}
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/register-doctor" element={<RegisterDoctor />} />
        <Route path="/register-doctor/doctor-profile" element={<RegisterProfileDoctor />} />
        
        {/* Sanitario*/}
        <Route path="/dashboard" element={
          userData?.ruolo === "sanitario" 
          ? <DashboardSanitario /> 
          : <Navigate to="/" />} 
        />
        <Route path="/sanitario/appuntamenti" element={
          userData?.ruolo === "sanitario"
          ? <SanitarioAppuntamenti />
          : <Navigate to="/" />}
        />
        <Route path="/pazienti" element={
          userData?.ruolo === "sanitario"
          ? <ListaPazienti />
          : <Navigate to="/" />}
        />
        <Route path="/referto/:idAppuntamento/:idSan/:idPaz" element={
          userData?.ruolo === "sanitario"
          ? <Referto />
          : <Navigate to="/" />}
        />
        <Route path="/lista-domande" element={
          userData?.ruolo === "sanitario"
          ? <DomandeSanitario />
          : <Navigate to="/" />}
        />
        
        {/* Accesso differenziato in base al ruolo nella pagina TuoAccount */}
        <Route path="/tuo-account/impostazioni" element={<TuoAccount />} />
        
        {/* Rotta dinamica per il profilo medico */}
        <Route path="/sanitario/:slug" element={<ProfiloSanitario />} />

        <Route path="/sanitario/scrivi-recensione/:uid" element={<CreaRecensione />} />
        
        {/* Paziente */}
        <Route path="/tuo-account/preferiti"  element={<SanitariPreferiti />} />
        <Route path="/tuo-account/lista-visite"  element={<ListaVisita />} />
        <Route path="/tuo-account/domande" element={<DomandePaziente />} />

      </Routes>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </BrowserRouter>
  );
}
