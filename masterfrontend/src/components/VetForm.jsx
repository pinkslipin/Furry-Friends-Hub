import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Grid, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from './Header';

const VetForm = ({ user, onLogout }) => {
    const [vetData, setVetData] = useState({
        vetid: '',
        fname: '',
        lname: '',
        specialization: '',
        phoneNum: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [notification, setNotification] = useState('');
    const [vets, setVets] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchVets();
    }, []);

    const fetchVets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vet/getAllVets');
            setVets(response.data);
        } catch (error) {
            console.error("Error fetching vets", error);
            setNotification("Error fetching veterinarians.");
        }
    };

    const handleChange = (e) => {
        setVetData({ ...vetData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!vetData.specialization) {
            newErrors.specialization = 'Specialization is required.';
        }
        if (!vetData.phoneNum) {
            newErrors.phoneNum = 'Phone number is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (isEditing) {
            if (!window.confirm("Are you sure you want to update this record?")) return;

            try {
                await axios.put(`http://localhost:8080/api/vet/putVetDetails?vetid=${vetData.vetid}`, vetData);
                setNotification('Veterinarian updated successfully!');
                resetForm();
                fetchVets();
            } catch (error) {
                console.error("Error updating veterinarian!", error);
                setNotification("Error updating veterinarian.");
            }
        }
    };

    const handleEdit = (vet) => {
        setVetData({
            ...vet,
            password: '',
            confirmPassword: ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (vetid) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/vet/deleteVet/${vetid}`);
            setNotification('Veterinarian deleted successfully!');
            fetchVets();
        } catch (error) {
            console.error("Error deleting veterinarian!", error);
            setNotification("Error deleting veterinarian.");
        }
    };

    const resetForm = () => {
        setVetData({
            vetid: '',
            fname: '',
            lname: '',
            specialization: '',
            phoneNum: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Header user={user} onLogout={onLogout} />
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Box sx={{ position: 'relative', mt: 4 }}>
                    <IconButton onClick={handleBack} sx={{ position: 'absolute', top: 1, left: -3 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" align="center" gutterBottom>
                        {isEditing ? 'Edit Veterinarian' : 'Current Veterinarians Employed'}
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
                                        value={vetData.fname}
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
                                        value={vetData.lname}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        name="specialization"
                                        label="Specialization"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={vetData.specialization}
                                        required
                                    />
                                    {errors.specialization && (
                                        <Typography color="error" variant="body2">
                                            {errors.specialization}
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="tel"
                                        name="phoneNum"
                                        label="Phone Number"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={vetData.phoneNum}
                                        required
                                    />
                                    {errors.phoneNum && (
                                        <Typography color="error" variant="body2">
                                            {errors.phoneNum}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Update Vet
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
                        {vets.map((vet) => (
                            <ListItem key={vet.vetid} divider>
                                <ListItemText primary={`${vet.fname} ${vet.lname}`} secondary={vet.specialization} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(vet)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(vet.vetid)}>
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

export default VetForm;
