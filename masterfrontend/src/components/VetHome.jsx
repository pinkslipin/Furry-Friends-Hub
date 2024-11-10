import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import Header from './Header';

const VetHome = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const userEmail = location.state?.email;

    useEffect(() => {
        if (user || !userEmail) return;

        const fetchVetData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/vet/profile', {
                    params: { email: userEmail }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching vet data', error);
            }
        };

        fetchVetData();
    }, [user, userEmail]);

    const handleLogout = () => {
        // Clear any user data or authentication state
        localStorage.removeItem('user'); // or session storage or state, depending on how you're managing login
        navigate('/vetlogin'); // Use navigate for redirection
    };

    return (
        <Container maxWidth="false" sx={{ mt: 8, overflowY: 'auto', height: '100vh' }}>
            {user ? (
                <>
                    <Header onLogout={handleLogout} user={user} /> {/* Header already includes profile */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h4" component="h2">
                            Welcome to Vet Home, {user.fname}
                        </Typography>
                    </Box>
                </>
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
