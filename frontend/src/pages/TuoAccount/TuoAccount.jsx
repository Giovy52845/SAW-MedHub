import { Navigate } from "react-router-dom"

import { useAuth } from "../../AuthContext"
import TuoAccountPazienti from "./TuoAccountPazienti"
import TuoAccountSanitario from "./TuoAccountSanitari"

import "./TuoAccount.css"

export default function TuoAccount() {
    const { userData, loading } = useAuth();

    if (loading || userData === null) {
        return <p>Caricamento...</p>;
    }

    if (userData?.ruolo === "paziente") {
        return <TuoAccountPazienti />;
    } else if (userData?.ruolo === "sanitario") {
        return <TuoAccountSanitario />;
    } else {
        return <Navigate to="/" />;
    }
}
