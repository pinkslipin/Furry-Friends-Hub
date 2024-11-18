// OwnerLoginOrSignupPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import logo from '../images/logo.png';
import Paw from '../images/Paw.png';
import './OwnerHome.css';

const OwnerLoginorSignupPage = () => (
    <Box sx={{ textAlign: 'center', padding: '20px' }}>
        <div className="homepage">
            <header className="content">
                <div className="welcome-message">
                    <h1>
                        <img src={logo} alt="FurryFriends Hub Logo" className="logo-image2" />
                        Welcome to <span>FurryFriends Hub</span>
                        <br></br>
                        Owner Portal
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
            <Button component={Link} to="/owner-signup" variant="contained" color="primary">
                Owner Signup
            </Button>
            <Button component={Link} to="/owner-login" variant="outlined" color="primary">
                Owner Login
            </Button>
        </div>
    </Box>
);

export default OwnerLoginorSignupPage;
