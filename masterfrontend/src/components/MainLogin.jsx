import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Link, InputAdornment, IconButton, Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import vetImage from '../images/vetimage.png';

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
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <ToggleButtonGroup
                            value={userType}
                            exclusive
                            onChange={handleTypeChange}
                            aria-label="user type"
                        >
                            <ToggleButton value="OWNER">Owner</ToggleButton>
                            <ToggleButton value="VET">Vet</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            type="email"
                            name="email"
                            label="Email Address"
                            variant="outlined"
                            margin="normal"
                            onChange={handleChange}
                            required
                        />
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
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{
                                marginTop: '16px',
                                backgroundColor: '#125B9A',
                            }}
                        >
                            Login
                        </Button>
                    </form>
                    <Box style={{ marginTop: '16px', textAlign: 'center' }}>
                        <Typography variant="body2">
                            Don't have an account? {' '}
                            <Link href="/owner-signup">
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </Container>
            </Grid>
        </Grid>
    );
};

export default MainLogin;
