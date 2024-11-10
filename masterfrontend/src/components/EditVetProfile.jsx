import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import Header from './Header';
import axios from 'axios';

const EditVetProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        phoneNumber: '',
        specialization: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                specialization: user.specialization
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put('http://localhost:8080/api/vet/profile', formData);
            alert('Profile updated successfully!');
            navigate('/vetprofile', { state: { user: response.data } });
        } catch (error) {
            console.error('Error updating vet profile:', error);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Header user={user} />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h4">Edit Profile</Typography>
            </Box>
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
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Specialization"
                    variant="outlined"
                    fullWidth
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
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
