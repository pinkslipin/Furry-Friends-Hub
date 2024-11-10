import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Header from './Header';
import axios from 'axios';

const EditVetProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const [formData, setFormData] = useState({
        vetid: '', // add vetid for update
        fname: '',
        lname: '',
        email: '',
        phoneNum: '',
        specialization: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user and vetid are present to populate form
        if (user && user.vetid) {
            setFormData({
                vetid: user.vetid,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                phoneNum: user.phoneNum,
                specialization: user.specialization
            });
        } else {
            setError("Vet data not available. Please go back and try again.");
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8080/api/vet/putVetDetails`, 
                { ...formData }, // send formData as body
                { params: { vetid: formData.vetid } } // vetid as a parameter
            );
            alert('Profile updated successfully!');
            navigate('/vetprofile', { state: { user: response.data } });
        } catch (error) {
            console.error('Error updating vet profile:', error);
            setError("An error occurred while updating the profile. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Header user={user} />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h4">Edit Profile</Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    disabled
                />
                <TextField
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    name="phoneNum"
                    value={formData.phoneNum}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Specialization</InputLabel>
                    <Select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        label="Specialization"
                    >
                        <MenuItem value="Small Animal Practice">Small Animal Practice</MenuItem>
                        <MenuItem value="Large Animal Practice">Large Animal Practice</MenuItem>
                        <MenuItem value="Mixed Animal Practice">Mixed Animal Practice</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ textAlign: 'center' }}>
                    <Button variant="contained" color="primary" type="submit">
                        Save Changes
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default EditVetProfile;
