import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    CircularProgress,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Chip,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from './Header';

const AdoptionRequest = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;

    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPets = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/pet/no-owner');
                console.log(response.data);
                setPets(response.data);
            } catch (error) {
                console.error('Error fetching pets:', error.response ? error.response.data : error.message);
                alert(`Error: ${error.response ? error.response.status : ''}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    const handleAdoptPet = async (pid) => {
        if (!user || !user.ownerId) {
            alert("You must be logged in to adopt a pet.");
            return;
        }

        if (!pid || pid === 0) { // Check for invalid pet ID
            alert("Invalid pet ID.");
            return;
        }
    
        // Function to format the date for display in Manila timezone
        const formatDate = (dateString) => {
            const utcDate = new Date(dateString);
            const manilaDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);
            return manilaDate.toLocaleString('en-PH', {
                timeZone: 'Asia/Manila',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });
        };
    
        const currentDateISO = new Date().toISOString();
        const formattedDateForDisplay = formatDate(currentDateISO);

        const payload = {
            pid,
            ownerId: user.ownerId,
            requestDate: currentDateISO,
            requestStatus: "pending",
        };
    
        console.log("Sending adoption request with payload:", payload);
    
        try {
            const response = await axios.post('http://localhost:8080/api/furryfriendshubadoption/createRequest', payload);
    
            alert(`Adoption request submitted successfully on ${formattedDateForDisplay}.`);
        } catch (error) {
            console.error('Error submitting adoption request:', error.response ? error.response.data : error.message);
            alert(`Error: ${error.response ? error.response.status : ''}`);
        }
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    return (
        <>
            <Header onLogout={handleLogoutClick} user={user} />
            
            <Container maxWidth="lg" sx={{ mt: 10 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4">Pets Available for Adoption</Typography>
                </Box>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {pets.map((pet) => (
                            <Grid item xs={12} sm={6} md={4} key={pet.pid}>
                                {pet.pid && pet.pid !== 0 ? (
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        weight="200"
                                        image={pet.petImage || pet.imageUrl} // Replace with a default URL if no image is provided
                                        alt={pet.petName}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {pet.petName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Species:</strong> {pet.species}<br />
                                            <strong>Breed:</strong> {pet.breed}<br />
                                            <strong>Age:</strong> {pet.age} years old<br />
                                            <strong>Weight:</strong> {pet.weight} kg<br />
                                            <strong>Medical Condition:</strong> {pet.medRec}
                                        </Typography>
                                        <Box mt={2}>
                                            {pet.tags?.map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    label={tag}
                                                    variant="outlined"
                                                    sx={{ marginRight: 0.5 }}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                console.log(pet.pid);
                                                handleAdoptPet(pet.pid);
                                            }}
                                        >
                                            Request Adoption
                                        </Button>
                                    </CardActions>
                                </Card>
                                 ) : (
                                    <p>Pet ID is missing or invalid</p>  // Handle invalid pet data
                                )}
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </>
    );
};

export default AdoptionRequest;
