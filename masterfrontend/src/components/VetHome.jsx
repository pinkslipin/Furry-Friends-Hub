import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import Header from './Header';
import logo from '../images/logo.png';
import Paw from '../images/Paw.png';
import './OwnerHome.css';

const VetHome = ({ onLogout, user }) => {
    const [vetData, setVetData] = useState(null);
    const navigate = useNavigate();
    const userEmail = user?.email;

    useEffect(() => {
        if (vetData || !userEmail) return;

        const fetchVetData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/vet/profile', {
                    params: { email: userEmail },
                });
                setVetData(response.data);
            } catch (error) {
                console.error('Error fetching vet data', error);
            }
        };

        fetchVetData();
    }, [vetData, userEmail]);

    const handleLogout = () => {
        onLogout();
        navigate('/vetlogin');
    };

    return (
        <Container maxWidth="false" sx={{ mt: 1, overflowY: 'auto', height: '100vh' }}>
            {vetData ? (
                <div className="homepage">
                    <Header onLogout={handleLogout} user={user} />
                    <main className="content">
                        <div className="welcome-message">
                            <h1>
                                <img src={logo} alt="Vet Logo" className="logo-image2" />
                                Welcome to <span>Your Vet Portal</span>
                                <br />
                                Hello, {vetData.fname}.
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
                    </main>
                </div>
            ) : (
                <Box textAlign="center" sx={{ mt: 4 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Loading vet data...
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default VetHome;