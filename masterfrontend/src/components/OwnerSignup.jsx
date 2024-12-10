// OwnerSignup.jsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, Container, Grid, IconButton, InputAdornment, Link, TextField, Typography, keyframes } from '@mui/material'; // Add keyframes here
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react'; // Add useMemo import
import { useNavigate } from 'react-router-dom';
import pawIcon from '../images/Paw.png'; // Add this import
import vetImage from '../images/vetimage.png';

const OwnerSignup = () => {
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        phoneNumber: '',
        address: '',
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

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const float = keyframes`
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
        100% { transform: translateY(0px) rotate(0deg); }
    `;

    // Add this memoized paw elements configuration
    const pawElements = useMemo(() => {
        return [...Array(10)].map((_, index) => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            rotation: Math.random() * 360,
            animationDelay: `${index * 0.4}s`,
            duration: `${4 + index * 0.5}s`
        }));
    }, []); // Empty dependency array means this runs once when component mounts

    return (
        <Grid container style={{ height: '100vh' }}>
            {/* Left Section */}
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

                {/* Replace the existing paw mapping with this: */}
                {pawElements.map((paw, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={pawIcon}
                        alt="Paw Icon"
                        sx={{
                            position: 'absolute',
                            width: '38px',
                            height: '38px',
                            opacity: 0.7,
                            animation: `${float} ${paw.duration} ease-in-out infinite`,
                            animationDelay: paw.animationDelay,
                            top: paw.top,
                            left: paw.left,
                            transform: `rotate(${paw.rotation}deg)`,
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                            zIndex: 1,
                        }}
                    />
                ))}

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

            {/* Right Section */}
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
                                onClick={() => navigate('/login')}
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
                                Create an Account
                            </Typography>
                        </motion.div>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Replace all TextField components with the enhanced version */}
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
                                            type="text"
                                            name="phoneNumber"
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
                                            type="text"
                                            name="address"
                                            label="Address"
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
                                        {passwordError && (
                                            <Typography color="error" variant="body2">
                                                {passwordError}
                                            </Typography>
                                        )}
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
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
                                    Sign Up
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div {...fadeIn} transition={{ delay: 0.7 }}>
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body2">
                                    Already have an account? {' '}
                                    <Link 
                                        href="/login"
                                        sx={{
                                            color: '#125B9A',
                                            textDecoration: 'none',
                                            fontWeight: 500,
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                color: '#f05a7e',
                                            },
                                        }}
                                    >
                                        Login
                                    </Link>
                                </Typography>
                            </Box>
                        </motion.div>
                    </Box>
                </Container>
            </Grid>
        </Grid>
    );
};

export default OwnerSignup;
