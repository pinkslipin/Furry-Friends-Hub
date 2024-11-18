import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Box,
    IconButton,
    Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import Header from './Header';

const VetProfile = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const [vetData, setVetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVetData = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const response = await axios.get('http://localhost:8080/api/vet/profile', {
                        params: { email: user.email },
                    });
                    setVetData(response.data);
                    setError(null);
                } catch (err) {
                    setError('Failed to fetch vet profile data.');
                    console.error('Error fetching vet profile data:', err);
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('vetId', vetData.vetid);
            formData.append('image', file);

            try {
                const response = await axios.post('http://localhost:8080/api/vet/uploadImage', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                alert(response.data || 'Image uploaded successfully');
                setError(null);

                // Refresh vet data
                const updatedData = await axios.get('http://localhost:8080/api/vet/profile', {
                    params: { email: user.email },
                });
                setVetData(updatedData.data);
            } catch (err) {
                setError('Failed to upload image. Please try again.');
                console.error('Error uploading image:', err);
            }
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Header onLogout={handleLogoutClick} user={user} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Profile</Typography>
                <IconButton onClick={handleEditProfile}>
                    <EditIcon />
                </IconButton>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" align="center">
                    {error}
                </Typography>
            ) : (
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        {vetData.imageBase64 ? (
                            <img
                                src={`data:image/jpeg;base64,${vetData.imageBase64}`}
                                alt="Vet Profile"
                                style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                            />
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No profile image available
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            component="label"
                            sx={{ mt: 2, textTransform: 'none', borderRadius: 2 }}
                        >
                            Upload New Image
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </Button>
                    </Box>

                    <Typography variant="h5" gutterBottom align="center">
                        {vetData.fname} {vetData.lname}
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Email" secondary={vetData.email || 'Not available'} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Phone Number" secondary={vetData.phoneNum || 'Not available'} />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Specialization"
                                secondary={vetData.specialization || 'Not available'}
                            />
                        </ListItem>
                    </List>
                </Paper>
            )}
        </Container>
    );
};

export default VetProfile;
