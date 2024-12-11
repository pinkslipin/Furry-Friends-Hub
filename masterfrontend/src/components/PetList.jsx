import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Avatar,
    Paper,
    Modal,
    Backdrop,
    Fade,
    MenuItem,
    FormControl,
    Select
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function PetList() {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [filter, setFilter] = useState('All');
    const user = JSON.parse(localStorage.getItem('user'));
    const [selectedPet, setSelectedPet] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const fetchImage = async (pid) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/pet/image/${pid}`, { responseType: 'arraybuffer' });
            const blob = new Blob([new Uint8Array(response.data)], { type: 'image/jpeg' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error(`Error fetching image for pet ${pid}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const loadImages = async () => {
            const updatedPets = await Promise.all(
                pets.map(async (pet) => {
                    if (!pet.imageUrl) {
                        const fetchedImageUrl = await fetchImage(pet.pid);
                        return { ...pet, imageUrl: fetchedImageUrl };
                    }
                    return pet;
                })
            );
            setPets(updatedPets);
        };
        if (pets.some((pet) => !pet.imageUrl)) {
            loadImages();
        }
    }, [pets]);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const isVet = user?.role === 'VET';
                const endpoint = isVet
                    ? 'http://localhost:8080/api/pet/getAllPets'
                    : `http://localhost:8080/api/pet/owner/${user.ownerId}`;

                const response = await fetch(endpoint, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch pets: ${response.statusText}`);
                }

                const rawText = await response.text();

                try {
                    const data = JSON.parse(rawText);
                    const petsWithDetails = data.map(pet => ({
                        ...pet,
                        species: pet.species || 'N/A', // Ensure species is set
                        breed: pet.breed || 'N/A', // Ensure breed is set
                        weight: pet.weight || 'N/A', // Ensure weight is set
                        age: pet.age || 'N/A', // Ensure age is set
                        sex: pet.sex || 'N/A', // Ensure gender is set
                        gender: pet.gender || 'N/A', // Ensure gender is set
                    }));
                    setPets(Array.isArray(petsWithDetails) ? petsWithDetails : []);
                } catch (jsonError) {
                    console.error('Raw response:', rawText);
                    console.error('JSON parse error:', jsonError);
                    throw new Error('Invalid JSON response from server');
                }
            } catch (error) {
                console.error('Error fetching pets:', error);
                setError(error.message);
                setPets([]);
            }
        };

        if (user) {
            fetchPets();
        } else {
            setError('Please log in to view pets');
        }
    }, [lastUpdate]);

    const handleDelete = async () => {
        if (petToDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/pet/deletePet/${petToDelete.pid}`, {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete pet: ${response.statusText}`);
                }

                setPets(pets.filter((pet) => pet.pid !== petToDelete.pid));
                setLastUpdate(Date.now());
                setSnackbarMessage('Pet removed successfully');
                setSnackbarOpen(true);
                setModalOpen(false); // Close the modal
                setConfirmDeleteOpen(false); // Close the confirmation modal
            } catch (error) {
                console.error('Error deleting pet:', error);
                setError(error.message);
            }
        }
    };

    const openConfirmDelete = (pet) => {
        setPetToDelete(pet);
        setConfirmDeleteOpen(true);
    };

    const closeConfirmDelete = () => {
        setConfirmDeleteOpen(false);
        setPetToDelete(null);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleEdit = (pid) => {
        navigate(`/update-pet/${pid}`);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const handleAddPet = () => {
        navigate('/petform');
    };

    const handleCardClick = (pet) => {
        setSelectedPet(pet);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPet(null);
    };

    const filteredPets =
        filter === 'All' ? pets : pets.filter((pet) => pet.species.toLowerCase() === filter.toLowerCase());

    const isVet = user?.role === 'VET';

    if (error) {
        return (
            <Container maxWidth="lg" style={{ paddingTop: '2em' }}>
                <Typography variant="h6" color="error" align="center">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
            <Header onLogout={handleLogout} user={user} />
            <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#ffc1a8', mt: 5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" style={{ color: '#125B9A', fontWeight: 600 }}>
                            Your Pets
                        </Typography>
                        <FormControl variant="outlined" style={{ minWidth: 200 }}>
                            <Select
                                value={filter}
                                onChange={(event) => handleFilterChange(event.target.value)}
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
                        {filteredPets.map((pet) => (
                            <Grid item xs={6} sm={4} md={3} key={pet.pid}>
                                <Card
                                    style={{
                                        borderRadius: '10px',
                                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                        backgroundColor: '#ffffff',
                                        padding: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleCardClick(pet)}
                                >
                                    <Avatar
                                        src={pet.imageUrl || (pet.image ? `data:image/jpeg;base64,${pet.image}` : '/placeholder.png')}
                                        alt={pet.petName}
                                        sx={{ width: 120, height: 120, marginBottom: '8px' }}
                                    />
                                    <Typography variant="h6" style={{ color: '#4e342e', fontWeight: 600 }}>
                                        {pet.petName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {pet.breed}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {pet.age} years old
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                        {!isVet && (
                            <Grid item xs={6} sm={4} md={3}>
                                <Card
                                    style={{
                                        borderRadius: '10px',
                                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '200px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={handleAddPet}
                                >
                                    <AddCircleIcon style={{ fontSize: '50px', color: '#F05A7E' }} />
                                    <Typography variant="h6" style={{ fontWeight: 600, marginLeft: '8px' }}>
                                        Add Pet
                                    </Typography>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Paper>
            {selectedPet && (
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
                                {selectedPet.petName}
                            </Typography>
                            <img
                                src={selectedPet.imageUrl || (selectedPet.image ? `data:image/jpeg;base64,${selectedPet.image}` : '/placeholder.png')}
                                alt={selectedPet.petName}
                                style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
                            />
                            <Typography variant="body1" gutterBottom>
                                Species: {selectedPet.species}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Breed: {selectedPet.breed}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Age: {selectedPet.age} years old
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Weight: {selectedPet.weight} kg
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Gender: {selectedPet.gender}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleEdit(selectedPet.pid)}
                                    style={{
                                        color: '#125B9A',
                                        borderColor: '#125B9A',
                                        marginRight: '10px',
                                    }}
                                >
                                    Edit
                                </Button>
                                {!isVet && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => openConfirmDelete(selectedPet)}
                                        style={{
                                            color: '#F05A7E',
                                            borderColor: '#F05A7E',
                                        }}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            )}
            <Modal
                open={confirmDeleteOpen}
                onClose={closeConfirmDelete}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={confirmDeleteOpen}>
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
                        <Typography variant="h6" gutterBottom>
                            Are you sure you want to delete this pet?
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={closeConfirmDelete}
                                style={{
                                    color: '#125B9A',
                                    borderColor: '#125B9A',
                                    marginRight: '10px',
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleDelete}
                                style={{
                                    color: '#F05A7E',
                                    borderColor: '#F05A7E',
                                }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
}

export default PetList;

//add og gender field paras pet entity