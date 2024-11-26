import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Grid, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from './Header';

const OwnerForm = ({ user, onLogout }) => {
    const [ownerData, setOwnerData] = useState({
        ownerId: '',
        fname: '',
        lname: '',
        email: '',
        phoneNumber: '',
        address: '',
        paymentType: '',
        password: '',
        confirmPassword: '',
    });

    const [notification, setNotification] = useState('');
    const [owners, setOwners] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/furryfriendshubowner/getAllOwners');
            setOwners(response.data);
        } catch (error) {
            console.error("Error fetching vets", error);
            setNotification("Error fetching veterinarians.");
        }
    };

    const handleChange = (e) => {
        setOwnerData({ ...ownerData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!ownerData.fname) {
            newErrors.fname = 'First Name is required.';
        }
        if (!ownerData.lname) {
            newErrors.lname = 'Last Name is required.';
        }
        if (!ownerData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        console.log("Owner data on submit:", ownerData);

        if (isEditing) {
            if (!window.confirm("Are you sure you want to update this record?")) return;

            try {
                const updatedOwnerData = {
                    fname: ownerData.fname,
                    lname: ownerData.lname,
                    email: ownerData.email,
                    phoneNumber: ownerData.phoneNumber,
                    address: ownerData.address,
                    paymentType: ownerData.paymentType,
                    password: ownerData.password || undefined,
                };
                await axios.put(`http://localhost:8080/api/furryfriendshubowner/profile/edit/${ownerData.ownerId}`, updatedOwnerData);
                setNotification('Owner updated successfully!');
                resetForm();
                fetchOwners();
            } catch (error) {
                console.error("Error updating owner!", error);
                setNotification("Error updating owner.");
            }
        }
    };

    const handleEdit = (owner) => {
        setOwnerData({
            ownerId: owner.ownerId,
            fname: owner.fname,
            lname: owner.lname,
            email: owner.email,
            phoneNumber: owner.phoneNumber,
            address: owner.address,
            paymentType: owner.paymentType,
            password: owner.password || '',  // clear password field if not needed
            confirmPassword: ''  // clear confirm password field
        });
        setIsEditing(true);
    };

    const handleDelete = async (ownerId) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/furryfriendshubowner/deleteOwnerDetails/${ownerId}`);
            setNotification('Owner  deleted successfully!');
            fetchOwners();
        } catch (error) {
            console.error("Error deleting owner!", error);
            setNotification("Error deleting owner.");
        }
    };

    const resetForm = () => {
        setOwnerData({
            ownerId: '',
            fname: '',
            lname: '',
            email: '',
            phoneNumber: '',
            address: '',
            paymentType: '',
            password: '',
            confirmPassword: ''
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleBack = () => {
        navigate('/ownerhome');
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <>
            <Header onLogout={handleLogoutClick} user={user} />
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Box sx={{ position: 'relative', mt: 4 }}>
                    <IconButton onClick={handleBack} sx={{ position: 'absolute', top: 1, left: -3 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" align="center" gutterBottom>
                        {isEditing ? 'Edit Owner' : 'Current Owners'}
                    </Typography>
                    {isEditing && (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        name="fname"
                                        label="First Name"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={ownerData.fname}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        name="lname"
                                        label="Last Name"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={ownerData.lname}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="tel"
                                        name="phoneNumber"
                                        label="Phone Number"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={ownerData.phoneNumber}
                                        required
                                    />
                                    {errors.phoneNumber && (
                                        <Typography color="error" variant="body2">
                                            {errors.phoneNumber}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Update Owner
                            </Button>
                            <Button type="button" variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleCancel}>
                                Cancel
                            </Button>
                        </form>
                    )}
                    {notification && (
                        <Typography color="error" align="center" sx={{ mt: 1 }}>
                            {notification}
                        </Typography>
                    )}
                    <List>
                        {owners.map((owner) => (
                            <ListItem key={owner.ownerId} divider>
                                <ListItemText primary={`${owner.fname} ${owner.lname}`} secondary={owner.email} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(owner)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(owner.ownerId)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Container>
        </>
    );
};

export default OwnerForm;
