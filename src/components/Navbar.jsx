import React, { useState } from 'react';
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
    MDBInputGroup
} from 'mdb-react-ui-kit';

import { useNavigate } from "react-router-dom";


export default function App() {
    const [openNavNoTogglerThird, setOpenNavNoTogglerThird] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.reload();
    }

    return (
        <>
            <MDBNavbar sticky expand='lg' dark bgColor='dark' style={{ "--mdb-bg-opacity": "0.9", 'backdropFilter': 'blur(2px)' }} >
                <MDBContainer fluid>
                    <MDBNavbarToggler
                        type='button'
                        data-target='#navbarTogglerDemo03'
                        data-mdb-toggle="collapse"
                        aria-controls='navbarTogglerDemo03'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        style={{ 'backgroundColor': 'grey' }}
                        onClick={() => setOpenNavNoTogglerThird(!openNavNoTogglerThird)}
                    >
                        <MDBIcon icon='bars' fas />
                    </MDBNavbarToggler>
                    <MDBNavbarBrand href='/'><strong>Kartavya</strong></MDBNavbarBrand>
                    <MDBCollapse navbar open={openNavNoTogglerThird}>
                        <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='#'>
                                    Home
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='#'>About Us</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href='#'>Admin?</MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                {localStorage.token ?
                                    <MDBNavbarLink href='/profile' tabIndex={-1} aria-disabled='true'>
                                        Profile
                                    </MDBNavbarLink> : <></>
                                }
                            </MDBNavbarItem>
                        </MDBNavbarNav>
                        {localStorage.token ?
                            <>
                                <MDBBtn outline style={{ width: '108px' }} onClick={handleLogout} color="danger" className='me-2' type='button'>
                                    Logout
                                </MDBBtn>
                            </>
                            :
                            <>
                                <MDBBtn outline style={{ width: '98px' }} onClick={() => navigate('/user/login')} color="success" className='me-2' type='button'>
                                    Login
                                </MDBBtn>
                                <MDBBtn outline style={{ width: '128px' }} onClick={() => navigate('/user/register')} color="success" className='me-2' type='button'>
                                    Register
                                </MDBBtn>
                            </>
                        }
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar >
        </>
    );
}