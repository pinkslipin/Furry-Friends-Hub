// OwnerLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Link, IconButton, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const OwnerLogin = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    }); 
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/furryfriendshubowner/login', formData);
            alert(response.data);
            const userData = response.data;
            onLogin(userData); 
            navigate('/ownerhome', { state: { email: formData.email } });
        } catch (error) {
            console.error('There was an error!', error);
            alert('Login failed!');
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
                <Typography variant="h4" align="center" gutterBottom>Owner Login</Typography>
                <form onSubmit={handleSubmit}>
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
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </form>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Don't have an account? <Link href="/owner-signup">Sign up</Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default OwnerLogin;
