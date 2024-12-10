import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import Header from './Header';
import logo from '../images/logo.png';
import Paw from '../images/Paw.png';
import dogGif from '../images/giphy.webp'; // Import the dog GIF
import './OwnerHome.css';

const Home = ({ onLogout }) => {
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

    const randomPosition = useCallback((existingPositions) => {
        const exclusionZones = [
            { top: 10, left: 10, width: 80, height: 30 }, // Text area
            { top: 50, left: 30, width: 40, height: 40 }, // GIF area
        ];

        const doesOverlap = (pos1, pos2) => {
            const distance = Math.sqrt(
                Math.pow(pos1.top - pos2.top, 2) + Math.pow(pos1.left - pos2.left, 2)
            );
            return distance < 10; // Minimum distance between two paws
        };

        let position;
        let isValid;
        do {
            position = {
                top: Math.random() * 80 + 10,
                left: Math.random() * 80 + 10,
            };

            isValid =
                exclusionZones.every(
                    (zone) =>
                        position.top < zone.top ||
                        position.top > zone.top + zone.height ||
                        position.left < zone.left ||
                        position.left > zone.left + zone.width
                ) &&
                existingPositions.every((existing) => !doesOverlap(position, existing));
        } while (!isValid);

        return position;
    }, []);

    const generatePawPositions = useCallback((count) => {
        const positions = [];
        for (let i = 0; i < count; i++) {
            positions.push(randomPosition(positions));
        }
        return positions;
    }, [randomPosition]);

    const [pawPositions, setPawPositions] = useState(generatePawPositions(12));

    useEffect(() => {
        const interval = setInterval(() => {
            setPawPositions(generatePawPositions(12));
        }, 3000);

        return () => clearInterval(interval);
    }, [generatePawPositions]);

    return (
        <Container maxWidth="false" sx={{ mt: 8, overflowY: 'auto', height: '100vh' }}>
            {user ? (
                <div className="homepage">
                    <Header onLogout={handleLogoutClick} user={user} />
                    <main className="content">
                        <div className="welcome-message">
                            <h1>
                                <img
                                    src={logo}
                                    alt="FurryFriends Hub Logo"
                                    className="logo-image2"
                                    style={{
                                        animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite, randomMove ${Math.random() * 3 + 2}s ease-in-out infinite`,
                                    }}
                                />
                                Welcome to <span>FurryFriends Hub</span>
                                <br />
                                Hello, {user.fname}.
                            </h1>
                            <div className="dog-gif">
                                <img src={dogGif} alt="Dog GIF" className="dog-image" />
                            </div>
                        </div>
                    </main>
                    {pawPositions.map((pos, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={Paw}
                            alt="Paw Icon"
                            sx={{
                                width: '60px',
                                height: '60px',
                                position: 'absolute',
                                top: `${pos.top}%`,
                                left: `${pos.left}%`,
                                animation: `${Math.random() * 3 + 2}s ease-in-out infinite`,
                            }}
                        />
                    ))}
                </div>
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

export default Home;
