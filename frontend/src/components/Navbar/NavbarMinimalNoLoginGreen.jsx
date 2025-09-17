import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { Link } from 'react-router-dom'

import MedHUB_logo from '../../assets/img/navbar_image.png';

import '../Navbar/MyNavbar.css'

export default function NavbarMinimalNoLoginGreen() {
    return (
        <section className='login-navbar'>
            <Navbar expand="lg" className="my-navbar" variant='light'>
                <Container> 
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img src={MedHUB_logo} alt="Logo MedHUB" className="me-2" />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Nav.Link as={Link} to="/login-page" className="navbar-item">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register-doctor" className="navbar-btn ms-3">Sei un professionista sanitario?</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </section>
    );
}