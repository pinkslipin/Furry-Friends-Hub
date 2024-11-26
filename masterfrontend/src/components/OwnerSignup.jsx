// OwnerSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Link, IconButton, Grid, InputAdornment, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import vetImage from '../images/vetimage.png';

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userType, setUserType] = useState('OWNER');
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleTypeChange = (event, newType) => {
        if (newType !== null) {
            setUserType(newType);
        }
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

        const signupData = { ...formData, role: userType };

        try {
            const response = await axios.post('http://localhost:8080/api/furryfriendshubowner/signup', signupData);
            alert(response.data);
            navigate('/login');
        } catch (error) {
            console.error('There was an error!', error);
            alert('Signup failed!');
        }
    };

    return (
        <Grid container style={{ height: '100vh', backgroundColor: '#ffe5e0' }}>
            {/* Left Section */}
            <Grid
                item
                xs={12}
                md={6}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    padding: '20px',
                    position: 'relative',
                }}
            >
                <Box
                    component="img"
                    src={vetImage}
                    alt="Vet illustration"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        height: 'auto',
                        opacity: 0.5,
                    }}
                />
                <Box style={{ textAlign: 'center', zIndex: 1 }}>
                    <Typography
                        variant="h3"
                        style={{
                            color: '#f05a7e',
                            fontWeight: 'bold',
                            marginBottom: '550px',
                        }}
                    >
                        Happiness starts here
                    </Typography>
                </Box>
            </Grid>

            {/* Right Section */}
            <Grid
                item
                xs={12}
                md={6}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffe5e0',
                }}
            >
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
                                        select
                                        name="paymentType"
                                        label="Payment Type"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={formData.paymentType}
                                        required
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="">Select Payment Type</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Debit Card">Debit Card</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Gcash">Gcash</option>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        label="Password"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
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
                                        type={showConfirmPassword ? "text" : "password"}
                                        label="Confirm Password"
                                        variant="outlined"
                                        margin="normal"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
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
            </Grid>
        </Grid>
    );
};

export default OwnerSignup;
