// MainHomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

const MainHomePage = () => {
    return (
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
            <Typography variant="h3" gutterBottom>
                Welcome to Furry Friends Hub
            </Typography>
            <Typography variant="h6" paragraph>
                Choose your role to continue.
            </Typography>
            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Button component={Link} to="/owner-login-signup" variant="contained" color="primary">
                    I'm an Owner
                </Button>
                <Button component={Link} to="/vet-login-signup" variant="outlined" color="primary">
                    I'm a Vet
                </Button>
            </Box>
        </Box>
    );
};

export default MainHomePage;
