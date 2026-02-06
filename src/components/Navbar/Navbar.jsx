import { useState, useEffect } from 'react';
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
import axios from 'axios';
import './Navbar.css';
import logo from '../../assets/kartavya-logo.png';
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config';

export default function App() {
    const [openNavNoTogglerThird, setOpenNavNoTogglerThird] = useState(false);
    const [hasPreviousDonation, setHasPreviousDonation] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDonations = async () => {
            if (localStorage.token) {
                try {
                    const response = await axios.get(
                        `${API_URL}/user/dashboard`,
                        {
                            headers: { Authorization: `Bearer ${localStorage.token}` }
                        }
                    );

                    if (response.data) {
                        const hasDonations =
                            response.data.totalDonations &&
                            response.data.totalDonations > 0;

                        setHasPreviousDonation(hasDonations);
                    }
                } catch (error) {
                    console.error('Error fetching user donations:', error);
                    setHasPreviousDonation(false);
                }
            } else {
                setHasPreviousDonation(false);
            }
        };

        fetchUserDonations();
    }, [localStorage.token]);

    const handleLogout = () => {
        localStorage.clear();
        setOpenNavNoTogglerThird(false);
        window.location.reload();
    };

    const handleNavigate = (path) => {
        setOpenNavNoTogglerThird(false);
        navigate(path);
    };

    return (
        <>
            <MDBNavbar
                sticky
                expand='lg'
                bgColor='light'
                style={{ "--mdb-bg-opacity": "0.9", backdropFilter: 'blur(2px)' }}
            >
                <MDBContainer fluid className="d-flex justify-content-between">

                    {/* Logo */}
                    <MDBNavbarBrand onClick={() => handleNavigate('/')} className="flex-shrink-0">
                        <img
                            src={logo}
                            height='110'
                            style={{ margin: '-20px 0 -30px 10px' }}
                            alt='Kartavya Logo'
                            loading='lazy'
                        />
                    </MDBNavbarBrand>

                    {/* Toggle Button */}
                    <MDBNavbarToggler
                        type='button'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        style={{ color: '#24a845' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenNavNoTogglerThird(!openNavNoTogglerThird);
                        }}
                    >
                        <MDBIcon icon='bars' fas />
                    </MDBNavbarToggler>

                    {/* Menu */}
                    <MDBCollapse navbar open={openNavNoTogglerThird} className="flex-grow-0">
                        <MDBNavbarNav className="justify-content-lg-end justify-content-center align-items-center text-center">

                            <MDBNavbarItem>
                                <MDBNavbarLink onClick={() => handleNavigate('/')}>Home</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink onClick={() => handleNavigate('/about')}>About Us</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink onClick={() => handleNavigate('/work')}>Our Work</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink onClick={() => handleNavigate('/news')}>Impact Stories</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink onClick={() => handleNavigate('/faqs')}>FAQs</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink onClick={() => handleNavigate('/contact')}>Contact Us</MDBNavbarLink>
                            </MDBNavbarItem>

                            {/* Dashboard */}
                            {localStorage.token && (
                                <MDBNavbarItem>
                                    <MDBNavbarLink
                                        onClick={() =>
                                            handleNavigate(
                                                localStorage.role === 'admin'
                                                    ? '/admin/general'
                                                    : '/user/dash'
                                            )
                                        }
                                    >
                                        {localStorage.role === 'admin' ? 'Settings' : 'Dashboard'}
                                    </MDBNavbarLink>
                                </MDBNavbarItem>
                            )}

                            {/* Login / Logout */}
                            {localStorage.token ? (
                                <MDBNavbarItem className="d-flex justify-content-center">
                                    <MDBBtn
                                        outline
                                        style={{ width: '108px' }}
                                        onClick={handleLogout}
                                        color="danger"
                                        className='me-2'
                                    >
                                        Logout
                                    </MDBBtn>
                                </MDBNavbarItem>
                            ) : (
                                <MDBNavbarItem className="d-flex justify-content-center">
                                    <MDBBtn
                                        outline
                                        style={{ width: '110px' }}
                                        onClick={() => handleNavigate('/login')}
                                        color="success"
                                        className='me-2'
                                    >
                                        Login
                                    </MDBBtn>
                                </MDBNavbarItem>
                            )}

                            {/* Donate / Re-Donate */}
                            <MDBNavbarItem className="d-flex justify-content-center">
                                {localStorage.token && hasPreviousDonation ? (
                                    <MDBBtn
                                        style={{ width: '130px' }}
                                        onClick={() => handleNavigate('/redonate')}
                                        className='btn-donate me-2'
                                    >
                                        <span>Re-Donate</span>
                                    </MDBBtn>
                                ) : (
                                    <MDBBtn
                                        style={{ width: '110px' }}
                                        onClick={() => handleNavigate('/donate')}
                                        className='btn-donate me-2'
                                    >
                                        <span>Donate</span>
                                    </MDBBtn>
                                )}
                            </MDBNavbarItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        </>
    );
}
