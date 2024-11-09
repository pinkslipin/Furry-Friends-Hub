import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress, Box, 
    IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import Header from './Header';

const AdoptionRequest = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;

    const [requests, setRequests] = useState([]);
    const [ownerId, setOwnerId] = useState(null);
    const [requestStatus, setRequestStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [requestIdToDelete, setRequestIdToDelete] = useState(null);

    useEffect(() => {
        if (user && user.ownerId) {
            setOwnerId(user.ownerId);
            console.log('Owner ID set from location.state:', user.ownerId);
        } else {
            console.log('User or ownerId not found in location.state:', user);
        }
    }, [user]);

    useEffect(() => {
        const fetchRequests = async () => {
            if (ownerId !== null) {
                setLoading(true);
                try {
                    console.log('Fetching requests for ownerId:', ownerId);
                    const response = await axios.get('http://localhost:8080/api/furryfriendshubadoption/getRequestsByOwner', {
                        params: { ownerId }
                    });
                    console.log('API Response:', response.data);
                    setRequests(response.data);
                } catch (error) {
                    console.error('Error fetching adoption requests:', error.response ? error.response.data : error.message);
                    alert(`Error ${error.response ? error.response.status : ''}: ${error.response ? error.response.data : error.message}`);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log('Owner ID is null, not fetching requests.');
                setLoading(false);
            }
        };
        fetchRequests();
    }, [ownerId]);

    const handleCreateRequest = async () => {
        if (!requestStatus) {
            alert("Request status cannot be empty.");
            return;
        }

        const newRequest = {
            requestDate: new Date().toISOString(), 
            requestStatus,
            ownerId
        };

        try {
            const response = await axios.post('http://localhost:8080/api/furryfriendshubadoption/createRequest', newRequest);
            setRequestStatus('');
            setRequests(prevRequests => [...prevRequests, response.data]);
        } catch (error) {
            console.error('Error creating adoption request:', error.response ? error.response.data : error.message);
            alert(`Error ${error.response ? error.response.status : ''}: ${error.response ? error.response.data : error.message}`);
        }
    };

    const handleDeleteClick = (requestId) => {
        setRequestIdToDelete(requestId);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/furryfriendshubadoption/deleteRequest/${requestIdToDelete}`);
            setRequests(prevRequests => prevRequests.filter(request => request.requestId !== requestIdToDelete));
        } catch (error) {
            console.error('Error deleting adoption request:', error);
        } finally {
            setOpenDialog(false);
            setRequestIdToDelete(null);
        }
    };

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

    const handleLogoutClick = () => {
        onLogout(); 
        navigate('/');
    };

    return (
        <>
            <Header onLogout={handleLogoutClick} user={user} />
            <Container maxWidth="md" sx={{ mt: 8 }}> 
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">Adoption Request</Typography>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={requestStatus}
                        onChange={(e) => setRequestStatus(e.target.value)}
                        placeholder="Enter request status"
                        sx={{ mb: 2 }} 
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={handleCreateRequest}
                                        sx={{ p: 1 }} 
                                    >
                                        <SendIcon />
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <List>
                        {requests.length > 0 ? (
                            requests.map(request => (
                                <ListItem key={request.requestId}>
                                    <ListItemText 
                                        primary={formatDate(request.requestDate)} 
                                        secondary={request.requestStatus} 
                                    />
                                    <Button 
                                        variant="outlined" 
                                        color="error" 
                                        onClick={() => handleDeleteClick(request.requestId)}
                                    >
                                        Delete
                                    </Button>
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No adoption requests found." />
                            </ListItem>
                        )}
                    </List>
                </>
            )}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this request? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
        </>
    );
};

export default AdoptionRequest;
