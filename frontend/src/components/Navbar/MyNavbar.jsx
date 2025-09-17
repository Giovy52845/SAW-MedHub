import { useAuth } from "../../AuthContext"
import PublicNavbar from "./PublicNavbar"
import NavbarMinimalNoLoginGreen from "./NavbarMinimalNoLoginGreen"
import PrivateNavbar from './PrivateNavbar'
import NavbarMinimalNoLoginLight from "./NavbarMinimalNoLoginLight";

export default function MyNavbar({ variant, type }) {
    const { user, loading } = useAuth();

    if(loading) return null;

    if(user) return <PrivateNavbar />

    // Se non loggato, scelgo la versione
    if(variant === 'minimal') {
        if(type === 'light') {
            return <NavbarMinimalNoLoginLight />
        }
        return <NavbarMinimalNoLoginGreen />
    }

    return <PublicNavbar />
}