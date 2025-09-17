import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { Link } from 'react-router-dom'

import MedHUB_logo_green from '../../assets/img/navbar_logo_green.png';

import '../Navbar/MyNavbar.css'

export default function NavbarMinimalNoLoginLight({ type }) {
    return (
        <section className='login-navbar-light'>
            <Navbar expand="lg" className="my-navbar-light" variant='light'>
                <Container> 
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img src={MedHUB_logo_green} alt="Logo MedHUB" className="me-2" />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Nav.Link as={Link} to="/login-page" className="navbar-item-light">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register-doctor" className="navbar-btn-light ms-3">Sei un professionista sanitario?</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </section>
    );
}