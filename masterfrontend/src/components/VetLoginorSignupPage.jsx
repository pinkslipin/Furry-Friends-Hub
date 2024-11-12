// VetLoginorSignupPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box } from '@mui/material';

const VetLoginorSignupPage = () => (
    <Box sx={{ textAlign: 'center', padding: '20px' }}>
        <Button component={Link} to="/VetSignup" variant="contained" color="primary">
            Vet Signup
        </Button>
        <Button component={Link} to="/VetLogin" variant="outlined" color="primary">
            Vet Login
        </Button>
    </Box>
);

export default VetLoginorSignupPage;
