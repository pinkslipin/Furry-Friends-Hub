import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import Header from './Header';
import logo from '../images/logo.png';
import Paw from '../images/Paw.png';
import './OwnerHome.css';

const Home = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const userEmail = location.state?.email || JSON.parse(localStorage.getItem('user'))?.email;

    useEffect(() => {
        if (user || !userEmail) return; 
    
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/furryfriendshubowner/profile', {
                    params: { email: userEmail }
                });
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };
    
        fetchUserData();
    }, [user, userEmail]);

    const handleLogoutClick = () => {
        onLogout(); 
        navigate('/login');
    };

    return (
        <>
            <Container maxWidth="false" sx={{ mt: 8, overflowY: 'auto', height: '100vh' }}>
                {user ? (
                    <div className="homepage">
                        <Header onLogout={handleLogoutClick} user={user} />
                        <main className="content">
                            <div className="welcome-message">
                                <h1>
                                    <img src={logo} alt="FurryFriends Hub Logo" className="logo-image2" />
                                    Welcome to <span>FurryFriends Hub</span>
                                    <br></br>
                                    Hello, {user.fname}.
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
                            Loading user data...
                        </Typography>
                    </Box>
                )}
            </Container>
        </>
    );
};

export default Home;
