import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Box, IconButton } from '@mui/material';
//import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
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
                    const response = await axios.get('http://localhost:8080/api/furryfriendshubadoption/getAllRequests');
                    setAdoptionRequests(response.data.filter(request => request.ownerId === user.ownerId));
                } catch (error) {
                    console.error('Error fetching adoption requests:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAdoptionRequests();
    }, [user]);

    const formatDate = (dateString) => {
        const utcDate = new Date(dateString);
        const manilaDate = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
    
        return manilaDate.toLocaleString('en-PH', {
            timeZone: 'Asia/Manila',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    const handleEditProfile = () => {
        navigate('/edit-profile', { state: { user } });
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
                    {/* <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton> */}
                    <Typography variant="h4">Profile</Typography>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper elevation={3} sx={{ padding: 3 }}>
                        <Typography variant="h5" gutterBottom align="center">
                            {user.fname} {user.lname}
                        </Typography>
                        <IconButton onClick={handleEditProfile} sx={{ ml: 55 }}>
                            <EditIcon />
                        </IconButton>
                        <List>
                            <ListItem>
                                <ListItemText primary="Email" secondary={user.email} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Phone Number" secondary={user.phoneNumber} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Address" secondary={user.address} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Payment Type" secondary={user.paymentType} />
                            </ListItem>
                        </List>

                        {adoptionRequests.length > 0 ? (
                            <div>
                                <Typography variant="h6" gutterBottom>
                                    Adoption Requests:
                                </Typography>
                                <List>
                                    {adoptionRequests.map((request, index) => (
                                        <ListItem key={index}>
                                            <ListItemText 
                                                primary={`Request ID: ${request.requestId}`}
                                                secondary={
                                                    <React.Fragment>
                                                        <Box>
                                                            <Typography component="span" variant="body2" color="text.secondary">
                                                                {`Status: ${request.requestStatus}`}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography component="span" variant="body2" color="text.secondary">
                                                                {`Date: ${formatDate(request.requestDate)}`}
                                                            </Typography>
                                                        </Box>
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        ) : (
                            <Typography>No adoption requests available.</Typography>
                        )}
                    </Paper>
                )}
            </Container>
        </>
    );
};

export default OwnerProfile;
