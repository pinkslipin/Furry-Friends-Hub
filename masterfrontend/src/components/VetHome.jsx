import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import Header from './Header';

const VetHome = ({ onLogout, user }) => {
    const [vetData, setVetData] = useState(null);
   // const location = useLocation();
    const navigate = useNavigate();
    const userEmail = user?.email;

    useEffect(() => {
        if (vetData || !userEmail) return;

        const fetchVetData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/vet/profile', {
                    params: { email: userEmail }
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
        <Container maxWidth="false" sx={{ mt: 8, overflowY: 'auto', height: '100vh' }}>
            {vetData ? (
                <>
                    <Header onLogout={handleLogout} user={user} />
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h4" component="h2">
                            Welcome to Vet Home, {vetData.fname}
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
