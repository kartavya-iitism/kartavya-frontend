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
        localStorage.clear();
        setOpenNavNoTogglerThird(false);
        window.location.reload();
    }

    const handleNavigate = (path) => {
        setOpenNavNoTogglerThird(false);
        navigate(path);
    }



    return (
        <>
            <MDBNavbar sticky expand='lg' bgColor='light' style={{ "--mdb-bg-opacity": "0.9", 'backdropFilter': 'blur(2px)' }} >
                <MDBContainer fluid className="d-flex justify-content-between">
                    <MDBNavbarBrand href='/' onClick={() => handleNavigate('/')} className="flex-shrink-0">
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
                        style={{ 'color': '#24a845' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenNavNoTogglerThird(!openNavNoTogglerThird);
                        }}
                    >
                        <MDBIcon icon='bars' fas />
                    </MDBNavbarToggler>
                    <MDBCollapse navbar open={openNavNoTogglerThird} className="flex-grow-0">
                        <MDBNavbarNav className="justify-content-lg-end justify-content-center align-items-center text-center">
                            <MDBNavbarItem>
                                <MDBNavbarLink href='/' onClick={() => handleNavigate('/')}>
                                    Home
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='/about' onClick={() => handleNavigate('/about')}>About Us</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='/work' onClick={() => handleNavigate('/work')}>Our Work</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='/news' onClick={() => handleNavigate('/news')}>Impact Stories</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='/faqs' onClick={() => handleNavigate('/faqs')}>FAQs</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='/contact' onClick={() => handleNavigate('/contact')}>Contact Us</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                {localStorage.token ?
                                    <MDBNavbarLink href={localStorage.role === 'admin' ? '/admin/general' : '/user/dash'} onClick={() => handleNavigate(localStorage.role === 'admin' ? '/admin/general' : '/user/dash')} tabIndex={-1} aria-disabled='true'>
                                        {localStorage.role === 'admin' ? 'Settings' : 'Dashboard'}
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
                                        <MDBBtn outline style={{ width: '110px' }} onClick={() => handleNavigate('/login')} color="success" className='me-2' type='button'>
                                            Login
                                        </MDBBtn>
                                    </MDBNavbarItem>
                                </>
                            }
                            <MDBNavbarItem className="d-flex justify-content-center">
                                <MDBBtn style={{ width: '110px' }} onClick={() => handleNavigate('/donate')} className='btn-donate me-2' type='button'>
                                    <span>Donate</span>
                                </MDBBtn>
                            </MDBNavbarItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        </>
    );
}