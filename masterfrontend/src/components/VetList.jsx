import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    CircularProgress,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Badge,
    Container,
    Paper,
} from '@mui/material';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        borderRadius: '50%',
        width: 10,
        height: 10,
        minWidth: 10,
        backgroundColor: ({ status }) =>
            status === 'Online'
                ? theme.palette.success.main
                : status === 'Away'
                ? theme.palette.warning.main
                : theme.palette.error.main,
        border: `2px solid ${theme.palette.background.paper}`,
    },
}));

const HoverCard = styled(Card)(({ theme }) => ({
    transition: 'transform 0.3s, box-shadow 0.3s',
    backgroundColor: '#ffc1a8',  // Match VetProfile background
    '&:hover': {
        transform: 'scale(1.05)', // Slightly increase the size on hover
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)', // Add a stronger shadow
    },
}));

const VetList = ({ user, onLogout }) => {
    const [vets, setVets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/owner-login');
    };

    useEffect(() => {
        axios
            .get('http://localhost:8080/api/vet/getAllVets')
            .then((response) => {
                setVets(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching vets:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
            <Header user={user} onLogout={handleLogout} />
            <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#ffc1a8', mt: 5 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
                    Meet Your Veterinarians!
                </Typography>
                {vets.length === 0 ? (
                    <Typography align="center">No Veterinarian available.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {vets.map((vet) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={vet.id}>
                                <HoverCard
                                    elevation={3}
                                    sx={{
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: 2,
                                        textAlign: 'center',
                                        height: 300, // Ensure consistent height for cards
                                        '& .MuiCardContent-root': {
                                            backgroundColor: '#FFD7C5',
                                            borderRadius: 1,
                                            width: '100%',
                                        }
                                    }}
                                >
                                    <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        badgeContent=""
                                        status={vet.status}
                                    >
                                        <Avatar
                                            src={
                                                vet.imageBase64
                                                    ? `data:image/jpeg;base64,${vet.imageBase64}`
                                                    : null
                                            }
                                            sx={{
                                                width: '100%',
                                                height: 160,
                                                borderRadius: 1, // Rectangular avatar
                                                marginBottom: 2,
                                            }}
                                        >
                                            {vet.fname.charAt(0)}
                                        </Avatar>
                                    </StyledBadge>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Dr. {vet.fname} {vet.lname}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {vet.specialization}
                                        </Typography>
                                    </CardContent>
                                </HoverCard>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Container>
    );
};

export default VetList;
