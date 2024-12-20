import { useState } from 'react';
import {
    MDBNavbar,
    MDBContainer,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBCollapse,
    MDBBtn,
    MDBNavbarNav,
    MDBIcon,
} from 'mdb-react-ui-kit';
import './Navbar.css'
import logo from '../../assets/kartavya-logo.png'
import { useNavigate } from "react-router-dom";

export default function App() {
    const [openNavNoTogglerThird, setOpenNavNoTogglerThird] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear()
        window.location.reload();
    }

    return (
        <>
            <MDBNavbar sticky expand='lg' bgColor='light' style={{ "--mdb-bg-opacity": "0.9", 'backdropFilter': 'blur(2px)' }} >
                <MDBContainer fluid className="d-flex justify-content-between">
                    <MDBNavbarBrand href='#' className="flex-shrink-0">
                        <img
                            src={logo}
                            height='110'
                            style={{ 'margin': '-20px 0 -30px 10px' }}
                            alt=''
                            loading='lazy'
                        />
                    </MDBNavbarBrand>
                    <MDBNavbarToggler
                        type='button'
                        data-target='#navbarTogglerDemo03'
                        aria-controls='navbarTogglerDemo03'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        style={{ 'backgroundColor': 'white', 'color': '#24a845' }}
                        onClick={() => setOpenNavNoTogglerThird(!openNavNoTogglerThird)}
                    >
                        <MDBIcon icon='bars' fas />
                    </MDBNavbarToggler>
                    <MDBCollapse navbar open={openNavNoTogglerThird} className="flex-grow-0">
                        <MDBNavbarNav className="justify-content-lg-end justify-content-center align-items-center text-center">
                            <MDBNavbarItem>
                                <MDBNavbarLink href='#'>
                                    Home
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='#'>About Us</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='#'>Our Work</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='#'>FAQs</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='#'>Contact Us</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                {localStorage.token ?
                                    <MDBNavbarLink href='/profile' tabIndex={-1} aria-disabled='true'>
                                        Profile
                                    </MDBNavbarLink> : <></>
                                }
                            </MDBNavbarItem>

                            {localStorage.token ?
                                <MDBNavbarItem className="d-flex justify-content-center">
                                    <MDBBtn outline style={{ width: '108px' }} onClick={handleLogout} color="danger" className='me-2' type='button'>
                                        Logout
                                    </MDBBtn>
                                </MDBNavbarItem>
                                :
                                <>
                                    <MDBNavbarItem className="d-flex justify-content-center">
                                        <MDBBtn outline style={{ width: '110px' }} onClick={() => navigate('/login')} color="success" className='me-2' type='button'>
                                            Login
                                        </MDBBtn>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem className="d-flex justify-content-center">
                                        <MDBBtn style={{ width: '110px' }} onClick={() => navigate('/donate')} className='btn-donate me-2' type='button'>
                                            <span>Donate</span>
                                        </MDBBtn>
                                    </MDBNavbarItem>
                                </>
                            }
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        </>
    );
}