// OwnerLoginOrSignupPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box } from '@mui/material';

const OwnerLoginorSignupPage = () => (
    <Box sx={{ textAlign: 'center', padding: '20px' }}>
        <Button component={Link} to="/owner-signup" variant="contained" color="primary">
            Owner Signup
        </Button>
        <Button component={Link} to="/owner-login" variant="outlined" color="primary">
            Owner Login
        </Button>
    </Box>
);

export default OwnerLoginorSignupPage;
