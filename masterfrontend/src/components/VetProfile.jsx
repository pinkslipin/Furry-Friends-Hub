import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import Header from './Header';

const VetProfile = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const [vetData, setVetData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVetData = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const response = await axios.get('http://localhost:8080/api/vet/profile', {
                        params: { email: user.email }
                    });
                    setVetData(response.data);
                } catch (error) {
                    console.error('Error fetching vet profile data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchVetData();
    }, [user]);

    const handleEditProfile = () => {
        navigate('/edit-vet-profile', { state: { user } });
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    return (
        <>
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Header onLogout={handleLogoutClick} user={user} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4">Profile</Typography>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper elevation={3} sx={{ padding: 3 }}>
                        <Typography variant="h5" gutterBottom align="center">
                            {vetData.fname} {vetData.lname}
                        </Typography>
                        <IconButton onClick={handleEditProfile} sx={{ ml: 55 }}>
                            <EditIcon />
                        </IconButton>
                        <List>
                            <ListItem>
                                <ListItemText primary="Email" secondary={vetData.email} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Phone Number" secondary={vetData.phoneNum} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Specialization" secondary={vetData.specialization} />
                            </ListItem>
                        </List>
                    </Paper>
                )}
            </Container>
        </>
    );
};

export default VetProfile;
