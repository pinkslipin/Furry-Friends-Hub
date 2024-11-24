// MainHomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

const MainHomePage = () => {
    return (
        <Box sx={{ 
            textAlign: 'center', 
            padding: '20px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffe5e0'
        }}>
            <Typography 
                variant="h2" 
                gutterBottom 
                sx={{ 
                    color: '#f05a7e',
                    fontWeight: 'bold',
                    marginBottom: '2rem'
                }}
            >
                Welcome to Furry Friends Hub
            </Typography>
            <Typography 
                variant="h5" 
                paragraph 
                sx={{ 
                    color: '#125B9A',
                    marginBottom: '3rem'
                }}
            >
                Your one-stop solution for pet care and management
            </Typography>
            <Button 
                component={Link} 
                to="/login" 
                variant="contained" 
                sx={{
                    backgroundColor: '#125B9A',
                    padding: '15px 40px',
                    fontSize: '1.2rem',
                    '&:hover': {
                        backgroundColor: '#0e4677'
                    }
                }}
            >
                Click Me
            </Button>
        </Box>
    );
};

export default MainHomePage;
