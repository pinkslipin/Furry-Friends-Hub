// VetSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Link, IconButton, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from './Header';

const VetSignup = ({onLogout}) => {
    const [vetData, setVetData] = useState({
        fname: '',
        lname: '',
        specialization: '',
        phoneNum: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'VET'
    });
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    const handleChange = (e) => {
        setVetData({ ...vetData, [e.target.name]: e.target.value });
    };

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

    const handleSignup = async (e) => {
        e.preventDefault();
        if (vetData.password !== vetData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(vetData.password)) {
            return;
        }

        try {
            const vetDataWithRole = { ...vetData, role: 'VET' }; // Ensure role is always 'VET'
            await axios.post('http://localhost:8080/api/vet/postvetrecord', vetDataWithRole, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            navigate('/vethome');
        } catch (err) {
            setError('Error signing up. Please try again.');
        }
    };

    const handleLogoutClick = () => {
        onLogout(); 
        navigate('/login');
    };


    return (
        <>
        <Header onLogout={handleLogoutClick} user={user}/>
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Box sx={{ position: 'relative', mt: 4 }}>
                <IconButton
                    onClick={() => navigate('/vethome')}
                    sx={{ position: 'absolute', top: 1, left: -10 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" align="center" gutterBottom>Register Vet Account</Typography>
                <form onSubmit={handleSignup}>
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
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" margin="normal" required>
                                <InputLabel>Specialization</InputLabel>
                                <Select
                                    name="specialization"
                                    value={vetData.specialization}
                                    onChange={handleChange}
                                    label="Specialization"
                                >
                                    <MenuItem value="Small Animal Practice">Small Animal Practice</MenuItem>
                                    <MenuItem value="Large Animal Practice">Large Animal Practice</MenuItem>
                                    <MenuItem value="Mixed Animal Practice">Mixed Animal Practice</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="tel"
                                name="phoneNum"
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
                                type="password"
                                name="password"
                                label="Password"
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
                                name="confirmPassword"
                                label="Confirm Password"
                                variant="outlined"
                                margin="normal"
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                    </Grid>
                    {error && (
                        <Typography color="error" align="center" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    {passwordError && (
                        <Typography color="error" align="center" sx={{ mt: 1 }}>
                            {passwordError}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Sign Up
                    </Button>
                </form>
                {/* <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Already have an account? <Link href="/vetlogin">Login</Link>
                    </Typography>
                </Box> */}
            </Box>
        </Container>
        </>
    );
};

export default VetSignup;
