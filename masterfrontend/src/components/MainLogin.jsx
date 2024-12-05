import React, { useState, useMemo } from 'react'; // Add useMemo import
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Link, InputAdornment, IconButton, Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { keyframes } from '@mui/system'; // Add this import
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import vetImage from '../images/vetimage.png';
import pawIcon from '../images/Paw.png';

const MainLogin = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [userType, setUserType] = useState('OWNER');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleTypeChange = (event, newType) => {
        if (newType !== null) {
            setUserType(newType);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = userType === 'OWNER' 
                ? 'http://localhost:8080/api/furryfriendshubowner/login'
                : 'http://localhost:8080/api/vet/login';

            const response = await axios.post(endpoint, formData);
            const userData = { ...response.data, role: userType };
            onLogin(userData);
            navigate(userType === 'OWNER' ? '/ownerhome' : '/vethome', { 
                state: { email: formData.email }
            });
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed!'); //ilisi ni ninyo ug lain ayaw alert
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

    // Generate paw positions once and memoize them
    const pawElements = useMemo(() => {
        return [...Array(12)].map((_, index) => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            rotation: Math.random() * 360,
            animationDelay: `${index * 0.3}s`,
            duration: `${3 + index * 0.4}s`
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ 
                        textAlign: 'center',
                        zIndex: 1,
                        marginTop: '2rem',
                        position: 'relative'
                    }}
                >
                    <Typography
                        variant="h3"
                        style={{
                            color: '#f05a7e',
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                            fontFamily: 'Montserrat, sans-serif',
                            letterSpacing: '1px'
                        }}
                    >
                        Happiness starts here
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
                        Your trusted companion in pet care
                    </Typography>
                </motion.div>

                {/* Adding floating paw icons */}
                {pawElements.map((paw, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={pawIcon}
                        alt="Paw Icon"
                        sx={{
                            position: 'absolute',
                            width: '35px',
                            height: '35px',
                            opacity: 0.75,
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
                <Container maxWidth="xs">
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
                            Welcome Back!
                        </Typography>
                    </motion.div>

                    <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                        <ToggleButtonGroup
                            value={userType}
                            exclusive
                            onChange={handleTypeChange}
                            aria-label="user type"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                margin: '1.5rem 0',
                                width: '100%',
                            }}
                        >
                            <ToggleButton 
                                value="OWNER"
                                style={{
                                    flex: 1,
                                    padding: '10px 20px',
                                    borderRadius: '8px 0 0 8px',
                                }}
                            >
                                Owner
                            </ToggleButton>
                            <ToggleButton 
                                value="VET"
                                style={{
                                    flex: 1,
                                    padding: '10px 20px',
                                    borderRadius: '0 8px 8px 0',
                                }}
                            >
                                Vet
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <form onSubmit={handleSubmit}>
                            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    name="email"
                                    label="Email Address"
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
                                    }}
                                />
                            </motion.div>

                            <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
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
                                    }}
                                />
                            </motion.div>

                            <motion.div {...fadeIn} transition={{ delay: 0.5 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        marginTop: '20px',
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
                                    Login
                                </Button>
                            </motion.div>
                        </form>
                    </motion.div>

                    <motion.div {...fadeIn} transition={{ delay: 0.6 }}>
                        <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
                            <Typography variant="body2">
                                Don't have an account? {' '}
                                <Link 
                                    href="/owner-signup"
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
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </motion.div>
                </Container>
            </Grid>
        </Grid>
    );
};

export default MainLogin;
