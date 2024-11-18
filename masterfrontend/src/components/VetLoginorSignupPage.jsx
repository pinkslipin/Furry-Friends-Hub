// VetLoginorSignupPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import logo from '../images/logo.png';
import Paw from '../images/Paw.png';
import './OwnerHome.css';

const VetLoginorSignupPage = () => (
    <Box sx={{ textAlign: 'center', padding: '20px' }}>
        <div className="homepage">
            <header className="content">
                <div className="welcome-message">
                    <h1>
                        <img src={logo} alt="FurryFriends Hub Logo" className="logo-image2" />
                        Welcome to <span>FurryFriends Hub</span>
                        <br></br>
                        Vet Portal
                    </h1>
                    <div className="paw-prints">
                        <span>
                            <img src={Paw} alt="Paw Print" className="paw-image" />
                        </span>
                        <span>
                            <img src={Paw} alt="Paw Print" className="logo-image2" />
                        </span>
                    </div>
                </div>
            </header>
            <Button component={Link} to="/VetLogin" variant="outlined" color="primary">
                Vet Login
            </Button>
        </div>
    </Box>
);

export default VetLoginorSignupPage;
