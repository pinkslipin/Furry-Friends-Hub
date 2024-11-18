import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container,
    Typography,
    TextField,
    Paper,
    CircularProgress,
    Box,
    IconButton,
    Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import Header from './Header';

const OwnerProfile = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdoptionRequests = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const response = await axios.get(
                        'http://localhost:8080/api/furryfriendshubadoption/getAllRequests'
                    );
                    setAdoptionRequests(
                        response.data.filter((request) => request.ownerId === user.ownerId)
                    );
                } catch (error) {
                    console.error('Error fetching adoption requests:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAdoptionRequests();
    }, [user]);

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
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, mt: 5 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">Owner Profile</Typography>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#ffc1a8' }}>
                    {/* Display Owner Information */}
                    <TextField
                        label="First Name"
                        value={user.fname || ''}
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
                        value={user.lname || ''}
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
                        value={user.email || ''}
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
                        value={user.phoneNumber || ''}
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
                        value={user.address || ''}
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
                        value={user.paymentType || ''}
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

                    {/* Display Adoption Requests */}
                    {adoptionRequests.length > 0 ? (
                        <Box mt={3}>
                            <Typography variant="h6" gutterBottom>
                                Adoption Requests:
                            </Typography>
                            {adoptionRequests.map((request, index) => (
                                <Paper
                                    key={index}
                                    elevation={1}
                                    sx={{
                                        padding: 2,
                                        marginBottom: 2,
                                        backgroundColor: '#FFD7C5',
                                    }}
                                >
                                    <Typography variant="body1">
                                        <strong>Request ID:</strong> {request.requestId}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Status:</strong> {request.requestStatus}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Date:</strong> {new Date(request.requestDate).toLocaleString()}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    ) : (
                        <Typography>No adoption requests available.</Typography>
                    )}

                    {/* Edit Profile Button */}
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button
                            variant="outlined"
                            onClick={handleEditProfile}
                            sx={{
                                borderRadius: '30px',
                                padding: '10px 20px',
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                '&:hover': { borderColor: '#115293', color: '#115293' },
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

export default OwnerProfile;
