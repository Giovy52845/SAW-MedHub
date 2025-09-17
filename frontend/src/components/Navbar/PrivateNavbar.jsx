import './MyNavbar.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Link, useNavigate } from 'react-router-dom'

import { signOut } from 'firebase/auth'
import { auth } from "../../firebase/firebase"


import MedHUB_logo from '../../assets/img/navbar_image.png';

export default function PrivateNavbar() {

    const navigate = useNavigate();

    function handleLogout() {
        signOut(auth).then(() => {
            navigate("/")
        }).catch((error) => {
            console.error("Errore durante il logout:", error);
        });
    }

    return (
        <Navbar expand="lg" className="my-navbar" variant='light'>
            <Container>
                
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                <img src={MedHUB_logo} alt="Logo MedHUB" className="me-2" />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        <Nav.Link as={Link} to="/gdpr/patient-data" className="navbar-item">Trattamento dei dati</Nav.Link>
                        <Nav.Link as={Link} to="/domande-risposte" className="navbar-item">Chiedi al dottore</Nav.Link>

                        <NavDropdown title="Il mio account" id="basic-nav-dropdown" className="navbar-item">
                            <NavDropdown.Item as={Link} to="/tuo-account/impostazioni">Impostazioni dell'account</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/tuo-account/preferiti">Professionisti salvati</NavDropdown.Item>
                            <NavDropdown.Item as={Link} onClick={() => handleLogout()}>Esci</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
}