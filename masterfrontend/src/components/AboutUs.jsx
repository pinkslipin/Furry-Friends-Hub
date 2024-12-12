import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, CircularProgress, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import Header from './Header';
import PetsIcon from '@mui/icons-material/Pets';
import PaymentIcon from '@mui/icons-material/Payment';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import petaboutus1 from '../images/petaboutus1.jpg';
import petaboutus2 from '../images/petaboutus2.jpg';
import petaboutus3 from '../images/petaboutus3.jpg';
import petaboutusbackground from '../images/petaboutusbackground.png';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const AboutUs = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const userEmail = location.state?.email || JSON.parse(localStorage.getItem('user'))?.email;

    useEffect(() => {
        if (user || !userEmail) return;

        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/furryfriendshubowner/profile', {
                    params: { email: userEmail },
                });
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUserData();
    }, [user, userEmail]);

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 6, height: '100vh', overflowY: 'fill' }}>
            {user ? (
                <>
                    <Header onLogout={handleLogoutClick} user={user} />
                    <Box sx={{ padding: '2rem', textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ mb: 2, color: '#125B9A', fontWeight: 600 }}>
                            About Us
                        </Typography>
                        
                        <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem', lineHeight: 1.8 }}>
                            Welcome to <strong>Furry Friends Hub</strong>, your all-in-one solution for managing your pets' health
                            and adoption needs. We combine technology and compassion to simplify pet care.
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem', lineHeight: 1.8 }}>
                            Our journey began as a local vet clinic, but we have grown into a platform that allows pet owners to
                            track vaccinations, book appointments, and even explore adoption opportunities. Whether you're
                            caring for your pet or looking to find a new companion, Furry Friends Hub is here for you!
                        </Typography>
                        <Box
                            component="img"
                            src={petaboutusbackground} // Ensure this variable is imported and valid
                            alt="Team Photo Placeholder"
                            sx={{ width: '100%', maxWidth: 600, mt: 3, borderRadius: 2 }}
                        />


                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#125B9A' }}>
                            Our Features
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        boxShadow: 3,
                                        borderRadius: 2,
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={petaboutus1}
                                        alt="Feature 1 Placeholder"
                                    />
                                    <CardContent>
                                        <VaccinesIcon sx={{ fontSize: 40, mb: 1, color: '#ffc1a8' }} />
                                        <Typography variant="h6">Pet Health Management</Typography>
                                        <Typography variant="body2">
                                            Stay on top of your pet's vaccinations and medical appointments with real-time updates.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        boxShadow: 3,
                                        borderRadius: 2,
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={petaboutus2}
                                        alt="Feature 2 Placeholder"
                                    />
                                    <CardContent>
                                        <PaymentIcon sx={{ fontSize: 40, mb: 1, color: '#ffc1a8' }} />
                                        <Typography variant="h6">Simplified Billing</Typography>
                                        <Typography variant="body2">
                                            View and pay your bills online with ease and convenience.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        boxShadow: 3,
                                        borderRadius: 2,
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={petaboutus3}
                                        alt="Feature 3 Placeholder"
                                    />
                                    <CardContent>
                                        <PetsIcon sx={{ fontSize: 40, mb: 1, color: '#ffc1a8' }} />
                                        <Typography variant="h6">Pet Adoption</Typography>
                                        <Typography variant="body2">
                                            Explore pets available for adoption and submit requests effortlessly.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            mt: 8,
                            textAlign: 'center',
                            padding: '2rem',
                            backgroundColor: '#ffc1a8',
                            borderRadius: 2,
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: 6,
                            },
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#125B9A' }}>
                            Contact Us
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
                            We'd love to hear from you! Whether you have questions, suggestions, or need support, 
                            feel free to reach out to us.
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, fontSize: '1rem' }}>
                            Email: <a>support@furryfriendshub.com</a> <br />
                            Phone: +1-800-555-1234
                        </Typography>

                        {/* Social Media Links */}
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3 }}>
                            <a href="https://www.facebook.com/profile.php?id=100064738507145" target="_blank" rel="noopener noreferrer">
                                <FacebookIcon
                                    sx={{
                                        fontSize: 40,
                                        color: '#3b5998',
                                        transition: 'color 0.3s ease',
                                        '&:hover': { color: '#2d4373' },
                                    }}
                                />
                            </a>
                            <a href="https://x.com/furryfriendspro" target="_blank" rel="noopener noreferrer">
                                <TwitterIcon
                                    sx={{
                                        fontSize: 40,
                                        color: '#1da1f2',
                                        transition: 'color 0.3s ease',
                                        '&:hover': { color: '#0d8ddb' },
                                    }}
                                />
                            </a>
                            <a href="https://www.instagram.com/furry.friendsaus/" target="_blank" rel="noopener noreferrer">
                                <InstagramIcon
                                    sx={{
                                        fontSize: 40,
                                        color: '#e4405f',
                                        transition: 'color 0.3s ease',
                                        '&:hover': { color: '#d32d4c' },
                                    }}
                                />
                            </a>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 8, textAlign: 'center', padding: 2, backgroundColor: '#FFD7C5' }}>
                        <Typography variant="body2">
                            © 2024 Furry Friends Hub. All rights reserved.
                        </Typography>
                    </Box>
                </>
            ) : (
                <Box textAlign="center" sx={{ mt: 4 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Loading user data...
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default AboutUs;