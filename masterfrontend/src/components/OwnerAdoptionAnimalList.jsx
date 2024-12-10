import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Box
} from '@mui/material';
import Header from './Header';

const OwnerAdoptionAnimalList = ({ user, onLogout }) => {
    const [animals, setAnimals] = useState([]);

    const fetchAnimals = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/adoption/animals/list');
            setAnimals(response.data);
        } catch (error) {
            console.error('Error fetching animals:', error);
        }
    };

    const handleAdopt = async (animalId) => {
        try {
            const response = await axios.post('http://localhost:8080/api/furryfriendshubowner/adopt', null, {
                params: { ownerId: user.ownerId, animalId }
            });
            alert(response.data);
            fetchAnimals(); // Refresh the list after adoption
        } catch (error) {
            console.error('Error adopting animal:', error);
            alert('Failed to adopt animal');
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, []);

    return (
        <Container style={{ fontFamily: "Poppins, sans-serif" }}>
            <Header onLogout={onLogout} user={user} />
            <Box sx={{ mt: 10, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom style={{ color: "#125B9A", fontWeight: 600 }}>
                    Animals Available for Adoption
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {animals.map((animal) => (
                    <Grid item xs={12} sm={6} md={4} key={animal.animalid}>
                        <Card style={{ borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                            <CardMedia
                                component="img"
                                height="300"
                                image={animal.image ? `data:image/jpeg;base64,${animal.image}` : '/placeholder.png'}
                                alt={animal.animalname}
                            />
                            <CardContent>
                                <Typography variant="h6" style={{ fontWeight: 600 }}>
                                    {animal.animalname}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Species: {animal.species}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Breed: {animal.breed}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Age: {animal.age}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Gender: {animal.sex}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Weight: {animal.weight} kg
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Medical Record: {animal.medRec}
                                </Typography>
                                <Typography variant="body2" style={{ color: animal.status.toLowerCase() === 'available' ? 'green' : 'textSecondary', fontWeight: 600 }}>
                                    {animal.status.toLowerCase() === 'available' ? 'Available' : 'Adopted'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    style={{ marginTop: "10px" }}
                                    onClick={() => handleAdopt(animal.animalid)}
                                    disabled={animal.status.toLowerCase() !== 'available'}
                                >
                                    Adopt
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default OwnerAdoptionAnimalList;
