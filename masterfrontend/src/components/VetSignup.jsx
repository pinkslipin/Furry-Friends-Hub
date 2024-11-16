// VetSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Link, IconButton, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const VetSignup = () => {
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
    const navigate = useNavigate();

    const handleChange = (e) => {
        setVetData({ ...vetData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (vetData.password !== vetData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/vet/postvetrecord', vetData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            navigate('/vetlogin');
        } catch (err) {
            setError('Error signing up. Please try again.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ position: 'relative', mt: 4 }}>
                <IconButton
                    onClick={() => navigate('/')}
                    sx={{ position: 'absolute', top: 8, left: 8 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" align="center" gutterBottom>Vet Signup</Typography>
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
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Already have an account? <Link href="/vetlogin">Login</Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default VetSignup;
