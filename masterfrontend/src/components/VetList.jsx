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
    Modal,
    Backdrop,
    Fade,
    Box, // Add this import
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
    const [selectedVet, setSelectedVet] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };
    
    const handleProfileClick = () => {
        navigate('/ownerprofile', { state: { user } });
    };

    const handleCardClick = (vet) => {
        setSelectedVet(vet);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedVet(null);
    };

    useEffect(() => {
        axios
            .get('http://localhost:8080/api/vet/getAllVets')
            .then((response) => {
                const vetsWithDetails = response.data.map(vet => ({
                    ...vet,
                    contact: vet.phoneNum || 'N/A', // Ensure contact is set
                }));
                setVets(vetsWithDetails);
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
            <Header user={user} onLogout={handleLogout} onProfileClick={handleProfileClick} />
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
                                        cursor: 'pointer',
                                        '& .MuiCardContent-root': {
                                            backgroundColor: '#FFD7C5',
                                            borderRadius: 1,
                                            width: '100%',
                                        }
                                    }}
                                    onClick={() => handleCardClick(vet)}
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
            {selectedVet && (
                <Modal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={modalOpen}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                borderRadius: 2,
                                p: 4,
                                backgroundColor: '#ffffff',
                            }}
                        >
                            <Typography variant="h5" gutterBottom style={{ color: '#4e342e' }}>
                                Dr. {selectedVet.fname} {selectedVet.lname}
                            </Typography>
                            <img
                                src={selectedVet.imageBase64 ? `data:image/jpeg;base64,${selectedVet.imageBase64}` : '/placeholder.png'}
                                alt={selectedVet.fname}
                                style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
                            />
                            <Typography variant="body1" gutterBottom>
                                Specialization: {selectedVet.specialization}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Contact: {selectedVet.contact}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Email: {selectedVet.email}
                            </Typography>
                        </Box>
                    </Fade>
                </Modal>
            )}
        </Container>
    );
};

export default VetList;
