import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, TextField, Typography, Box, Button, CircularProgress, Paper } from '@mui/material';
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

            {/* Greeting Section */}
            <Box sx={{ mb: 6, pt: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
        {vetData?.fname || 'Veterinarian'} {vetData?.lname || 'Name'}
        </Typography>
        </Box>

            {/* Profile Details */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={4} sx={{ padding: 3, backgroundColor: '#FFD5C5' }}>
                    <form>
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
                    </form>
                </Paper>
            )}
        </Container>
    );
};

export default VetProfile;
