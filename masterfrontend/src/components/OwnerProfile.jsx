import React from 'react';
import { Container, TextField, Typography, Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

const OwnerProfile = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;

    const handleEditProfile = () => {
        navigate('/edit-profile', { state: { user } });
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    return (
        <Container maxWidth="sm" sx={{ paddingTop: 4 }}>
            <Header onLogout={handleLogoutClick} user={user} />
            
            {/* Greeting with First Name */}
            <Box sx={{ mb: 3 }}>

            </Box>

            {/* Profile Info Section */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    {user?.fname || 'User'} {user?.lname || 'User'}
                </Typography>
            </Box>

            {/* Profile Details */}
            <form>
                <TextField
                    label="First Name"
                    value={user?.fname || ""}
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
                    value={user?.lname || ""}
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
                    value={user?.email || ""}
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
                    value={user?.phoneNumber || ""}
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
                    label="Address"
                    value={user?.address || ""}
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
                    label="Payment Type"
                    value={user?.paymentType || ""}
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
        </Container>
    );
};

export default OwnerProfile;
