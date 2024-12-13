import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Link, IconButton, Grid, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material'; // Add Snackbar and Alert
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion'; // Add framer-motion
import Header from './Header';
import pawIcon from '../images/Paw.png'; // Add this import
import vetImage from '../images/vetimage.png'; // Add this import

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
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Add this state
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
            setSnackbarOpen(true); // Show snackbar on success
            setTimeout(() => {
                navigate('/vethome'); // Navigate after 3 seconds
            }, 2000);
        } catch (err) {
            setError('Error signing up. Please try again.');
        }
    };

    const handleLogoutClick = () => {
        onLogout(); 
        navigate('/login');
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <>
        <Header onLogout={handleLogoutClick} user={user}/>
        <Grid container style={{ height: '100vh' }}>
            <Grid
                item
                xs={12}
                md={6}
                component={motion.div}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    background: 'linear-gradient(45deg, #ffe5e0 25%, #ffd6cc 25%, #ffd6cc 50%, #ffe5e0 50%, #ffe5e0 75%, #ffd6cc 75%, #ffd6cc)',
                    backgroundSize: '40px 40px',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '0 20px 20px 0',
                }}
            >
                <motion.div
                    animate={{ 
                        scale: [1, 1.02, 1],
                        rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Box
                        component="img"
                        src={vetImage}
                        alt="Vet illustration"
                        style={{
                            width: '90%',
                            height: 'auto',
                            maxWidth: '500px',
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))',
                            borderRadius: '15px',
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ 
                        textAlign: 'center', 
                        zIndex: 2,
                        position: 'relative'
                    }}
                >
                    <Typography
                        variant="h3"
                        style={{
                            color: '#f05a7e',
                            fontWeight: 'bold',
                            marginTop: '2rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                            fontFamily: 'Montserrat, sans-serif',
                        }}
                    >
                        Join our community
                    </Typography>
                    <Typography
                        variant="h6"
                        style={{
                            color: '#125B9A',
                            marginTop: '1rem',
                            fontFamily: 'Georgia, serif',
                            fontStyle: 'italic',
                            opacity: 0.9
                        }}
                    >
                        Where pet care meets excellence
                    </Typography>
                </motion.div>
            </Grid>

            <Grid
                item
                xs={12}
                md={6}
                component={motion.div}
                {...fadeIn}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
                    boxShadow: '0 0 30px rgba(0,0,0,0.1)',
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{ position: 'relative', mt: 2 }}>
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <IconButton
                                onClick={() => navigate('/vethome')}
                                sx={{
                                    position: 'absolute',
                                    top: 2,
                                    left: 6,
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                    },
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </motion.div>

                        <motion.div {...fadeIn} style={{ textAlign: 'center' }}>
                            <Typography 
                                variant="h4" 
                                gutterBottom
                                style={{
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #ffb4a2, #d1b3c4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Register Vet Account
                            </Typography>
                        </motion.div>

                        <form onSubmit={handleSignup}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                                        <TextField
                                            fullWidth
                                            type="text"
                                            name="fname"
                                            label="First Name"
                                            variant="outlined"
                                            margin="normal"
                                            onChange={handleChange}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '10px',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '14px 16px',
                                                },
                                                minWidth: '240px',
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                                        <TextField
                                            fullWidth
                                            type="text"
                                            name="lname"
                                            label="Last Name"
                                            variant="outlined"
                                            margin="normal"
                                            onChange={handleChange}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '10px',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '14px 16px',
                                                },
                                                minWidth: '240px',
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12}>
                                    <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                                        <FormControl fullWidth variant="outlined" margin="normal" required>
                                            <InputLabel>Specialization</InputLabel>
                                            <Select
                                                name="specialization"
                                                value={vetData.specialization}
                                                onChange={handleChange}
                                                label="Specialization"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '10px',
                                                        transition: 'all 0.3s',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                        },
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        padding: '14px 16px',
                                                    },
                                                    minWidth: '240px',
                                                }}
                                            >
                                                <MenuItem value="Small Animal Practice">Small Animal Practice</MenuItem>
                                                <MenuItem value="Large Animal Practice">Large Animal Practice</MenuItem>
                                                <MenuItem value="Mixed Animal Practice">Mixed Animal Practice</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                                        <TextField
                                            fullWidth
                                            type="tel"
                                            name="phoneNum"
                                            label="Phone Number"
                                            variant="outlined"
                                            margin="normal"
                                            onChange={handleChange}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '10px',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '14px 16px',
                                                },
                                                minWidth: '240px',
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                                        <TextField
                                            fullWidth
                                            type="email"
                                            name="email"
                                            label="Email"
                                            variant="outlined"
                                            margin="normal"
                                            onChange={handleChange}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '10px',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '14px 16px',
                                                },
                                                minWidth: '240px',
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            name="password"
                                            label="Password"
                                            variant="outlined"
                                            margin="normal"
                                            onChange={handleChange}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '10px',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '14px 16px',
                                                },
                                                minWidth: '240px',
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            name="confirmPassword"
                                            label="Confirm Password"
                                            variant="outlined"
                                            margin="normal"
                                            onChange={handleChange}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '10px',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '14px 16px',
                                                },
                                                minWidth: '240px',
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                            </Grid>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Typography 
                                        color="error" 
                                        align="center" 
                                        sx={{ 
                                            mt: 1,
                                            padding: '8px',
                                            borderRadius: '8px',
                                            backgroundColor: 'rgba(211, 47, 47, 0.1)'
                                        }}
                                    >
                                        {error}
                                    </Typography>
                                </motion.div>
                            )}
                            {passwordError && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Typography 
                                        color="error" 
                                        align="center" 
                                        sx={{ 
                                            mt: 1,
                                            padding: '8px',
                                            borderRadius: '8px',
                                            backgroundColor: 'rgba(211, 47, 47, 0.1)'
                                        }}
                                    >
                                        {passwordError}
                                    </Typography>
                                </motion.div>
                            )}
                            <motion.div {...fadeIn} transition={{ delay: 0.6 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        background: 'linear-gradient(45deg, #125B9A, #1976d2)',
                                        borderRadius: '10px',
                                        padding: '12px',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 12px rgba(18,91,154,0.2)',
                                        },
                                    }}
                                >
                                    Register Account
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div {...fadeIn} transition={{ delay: 0.7 }}>
                        </motion.div>
                    </Box>
                </Container>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Set duration to 3000 milliseconds (3 seconds)
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Signup Successful! Redirecting to home page...
                </Alert>
            </Snackbar>
        </Grid>
        </>
    );
};

export default VetSignup;
