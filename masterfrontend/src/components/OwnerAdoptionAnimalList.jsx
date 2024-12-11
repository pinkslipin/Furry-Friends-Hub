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
    Box,
    Modal,
    Backdrop,
    Fade,
    MenuItem,
    FormControl,
    Select
} from '@mui/material';
import Header from './Header';

const OwnerAdoptionAnimalList = ({ user, onLogout }) => {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [filter, setFilter] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);

    const fetchAnimals = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/adoption/animals/list');
            setAnimals(response.data);
            setFilteredAnimals(response.data);
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
            setModalOpen(false); // Close the modal
        } catch (error) {
            console.error('Error adopting animal:', error);
            alert('Failed to adopt animal');
        }
    };

    const handleFilterChange = (event) => {
        const newFilter = event.target.value;
        setFilter(newFilter);
        if (newFilter === 'All') {
            setFilteredAnimals(animals);
        } else {
            setFilteredAnimals(animals.filter((animal) => animal.species.toLowerCase() === newFilter.toLowerCase()));
        }
    };

    const handleCardClick = (animal) => {
        setSelectedAnimal(animal);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedAnimal(null);
    };

    useEffect(() => {
        fetchAnimals();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
            <Header onLogout={onLogout} user={user} />
            <Box sx={{ mt: 10, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom style={{ color: '#4e342e', fontWeight: 600 }}>
                    Browse Pets
                </Typography>
                <FormControl variant="outlined" style={{ minWidth: 200 }}>
                    <Select
                        value={filter}
                        onChange={handleFilterChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        style={{ backgroundColor: '#ffffff', color: '#125B9A', borderColor: '#125B9A' }}
                    >
                        {['All', 'Cat', 'Dog', 'Reptile', 'Bird', 'Fish', 'Rabbits', 'Guinea Pigs', 'Hamsters'].map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {filteredAnimals.map((animal) => (
                    <Grid item xs={6} sm={4} md={3} key={animal.animalid}>
                        <Card
                            style={{
                                borderRadius: '10px',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                                backgroundColor: '#ffffff',
                                transition: 'transform 0.3s',
                            }}
                            onClick={() => handleCardClick(animal)}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={animal.image ? `data:image/jpeg;base64,${animal.image}` : '/placeholder.png'}
                                alt={animal.animalname}
                            />
                            <CardContent>
                                <Typography variant="h6" style={{ fontWeight: 600, color: '#4e342e' }}>
                                    {animal.animalname}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {animal.species}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {animal.age} years
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {selectedAnimal && (
                <Modal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500
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
                                backgroundColor: '#ffffff'
                            }}
                        >
                            <Typography variant="h5" gutterBottom style={{ color: '#4e342e' }}>
                                {selectedAnimal.animalname}
                            </Typography>
                            <img
                                src={
                                    selectedAnimal.image
                                        ? `data:image/jpeg;base64,${selectedAnimal.image}`
                                        : '/placeholder.png'
                                }
                                alt={selectedAnimal.animalname}
                                style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
                            />
                            <Typography variant="body1" gutterBottom>
                                Species: {selectedAnimal.species}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Breed: {selectedAnimal.breed}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Age: {selectedAnimal.age} years
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Weight: {selectedAnimal.weight} kg
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Gender: {selectedAnimal.sex}
                            </Typography>
                            <Typography
                                variant="body1"
                                gutterBottom
                                style={{
                                    color: selectedAnimal.status.toLowerCase() === 'available' ? '#2e7d32' : '#d32f2f',
                                    fontWeight: 600
                                }}
                            >
                                {selectedAnimal.status.toLowerCase() === 'available'
                                    ? 'Available for Adoption'
                                    : 'Already Adopted'}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => handleAdopt(selectedAnimal.animalid)}
                                disabled={selectedAnimal.status.toLowerCase() !== 'available'}
                                style={{ backgroundColor: '#125B9A', color: '#ffffff', marginTop: '10px' }}
                            >
                                Request Adoption
                            </Button>
                        </Box>
                    </Fade>
                </Modal>
            )}
        </Container>
    );
};

export default OwnerAdoptionAnimalList;
