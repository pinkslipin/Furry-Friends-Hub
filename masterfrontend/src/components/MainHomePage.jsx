import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Box, keyframes } from '@mui/material';
import mainPagePic2 from '../images/mainpagepic2.png';
import pawIcon from '../images/Paw.png';
import logo from '../images/logo.png';

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

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
            background: `linear-gradient(45deg, #ffe5e0 25%, #ffd6cc 25%, #ffd6cc 50%, #ffe5e0 50%, #ffe5e0 75%, #ffd6cc 75%, #ffd6cc)`,
            backgroundSize: '40px 40px',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <Box
                component="img"
                src={mainPagePic2}
                alt="Main Page"
                sx={{
                    height: 'auto',
                    maxHeight: '400px',
                    marginBottom: '2rem',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.3s ease-in-out',
                    animation: `${fadeIn} 1s ease-out`,
                    '&:hover': {
                        transform: 'scale(1.02)',
                    }
                }}
            />
            <Typography
                variant="h2"
                gutterBottom
                sx={{
                    color: '#f05a7e',
                    fontWeight: 'bold',
                    marginBottom: '2rem',
                    fontFamily: 'Montserrat, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: `${fadeIn} 1s ease-out 0.3s backwards`,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                Welcome to
                <Box
                    component="img"
                    src={logo}
                    alt="logo"
                    sx={{
                        width: '60px',
                        height: '60px',
                        margin: '0 15px',
                        animation: `${float} 3s ease-in-out infinite`
                    }}
                />
                Furry Friends Hub
            </Typography>
            <Typography
                variant="h5"
                paragraph
                sx={{
                    color: '#125B9A',
                    marginBottom: '3rem',
                    fontFamily: 'Georgia, serif',
                    animation: `${fadeIn} 1s ease-out 0.6s backwards`,
                    letterSpacing: '0.5px'
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
                    fontFamily: 'Montserrat, sans-serif',
                    borderRadius: '30px',
                    transition: 'all 0.3s ease',
                    animation: `${fadeIn} 1s ease-out 0.9s backwards`,
                    boxShadow: '0 4px 15px rgba(18, 91, 154, 0.2)',
                    '&:hover': {
                        backgroundColor: '#0e4677',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 20px rgba(18, 91, 154, 0.3)',
                    },
                    '&:active': {
                        transform: 'translateY(1px)',
                    }
                }}
            >
                Let's Get Started!
            </Button>
            {[...Array(15)].map((_, index) => (
                <Box
                    key={index}
                    component="img"
                    src={pawIcon}
                    alt="Paw Icon"
                    sx={{
                        position: 'absolute',
                        width: '40px',
                        height: '40px',
                        opacity: 0.8,
                        animation: `${float} ${3 + index * 0.5}s ease-in-out infinite`,
                        animationDelay: `${index * 0.3}s`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        zIndex: 1,
                    }}
                />
            ))}
        </Box>
    );
};

export default MainHomePage;