// OwnerSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Link, IconButton, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OwnerSignup = () => {
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        phoneNumber: '',
        address: '',
        paymentType: '',
        password: '',
        role: 'OWNER'
    });
    
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const minLength = 8;
        const specialCharacter = /[!@#$%^&*(),.?":{}|<>]/;
        if (password.length < minLength && !specialCharacter.test(password)){
            setPasswordError('Password must be at least 8 characters long and must contain at least one special character.');
            return false;
        }
        if (password.length < minLength) {
            setPasswordError('Password must be at least 8 characters long.');
            return false;
        }
        if (!specialCharacter.test(password)) {
            setPasswordError('Password must contain at least one special character.');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(formData.password)) {
            return;
        }

        if (formData.password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/api/furryfriendshubowner/signup', formData);
            alert(response.data);
            navigate('/login');
        } catch (error) {
            console.error('There was an error!', error);
            alert('Signup failed!');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ position: 'relative', mt: 4 }}>
                <IconButton
                    onClick={() => navigate('/login')}
                    sx={{ position: 'absolute', top: 8, left: 8 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" align="center" gutterBottom>Owner Signup</Typography>
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
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="email"
                                name="email"
                                label="Email"
                                variant="outlined"
                                margin="normal"
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="text"
                                name="phoneNumber"
                                label="Phone Number"
                                variant="outlined"
                                margin="normal"
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="text"
                                name="address"
                                label="Address"
                                variant="outlined"
                                margin="normal"
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="text"
                                name="paymentType"
                                label="Payment Type"
                                variant="outlined"
                                margin="normal"
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="password"
                                name="password"
                                label="Password"
                                variant="outlined"
                                margin="normal"
                                onChange={handleChange}
                                required
                            />
                            {passwordError && (
                                <Typography color="error" variant="body2">
                                    {passwordError}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm Password"
                                variant="outlined"
                                margin="normal"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                        </Grid>
                    </Grid>
                    {error && (
                        <Typography color="error" align="center" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Signup
                    </Button>
                </form>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Already have an account? <Link href="/login">Login</Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default OwnerSignup;
