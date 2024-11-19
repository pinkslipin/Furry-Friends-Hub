import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, TextField, Typography, Box, Button, CircularProgress, Paper, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
        <Container maxWidth="sm" sx={{ paddingTop: 4 }}>
            <Header onLogout={handleLogoutClick} user={user} />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, mt: 5 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4">Vet Profile</Typography>
                </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#ffc1a8' }}>
                    
                        <TextField
                            label="First Name"
                            value={vetData?.fname || ""}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                            sx={{
                                mb: 2,
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#FFD7C5',
                                },
                            }}
                        />
                        <TextField
                            label="Last Name"
                            value={vetData?.lname || ""}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                            sx={{
                                mb: 2,
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#FFD7C5',
                                },
                            }}
                        />
                        <TextField
                            label="Email"
                            value={vetData?.email || ""}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                            sx={{
                                mb: 2,
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#FFD7C5',
                                },
                            }}
                        />
                        <TextField
                            label="Phone Number"
                            value={vetData?.phoneNum || ""}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                            sx={{
                                mb: 2,
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#FFD7C5',
                                },
                            }}
                        />
                        <TextField
                            label="Specialization"
                            value={vetData?.specialization || ""}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                            sx={{
                                mb: 2,
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#FFD7C5',
                                },
                            }}
                        />

                        {/* Edit Button Section */}
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Button
                                variant="outlined"
                                onClick={handleEditProfile}
                                sx={{
                                    borderRadius: '30px',
                                    padding: '10px 20px',
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                    '&:hover': { borderColor: '#115293', color: '#115293' }
                                }}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                </Paper>
            )}
        </Container>
    );
};

export default VetProfile;