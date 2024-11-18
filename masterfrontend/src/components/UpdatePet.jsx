import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Snackbar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { PetUpdateDTO } from '../dto/PetUpdateDTO';
import Header from './Header';

function UpdatePet() {
    const { pid } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(new PetUpdateDTO());
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [open, setOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/pet/${pid}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch pet details');
                }

                const data = await response.json();
                setPet(new PetUpdateDTO(data));
            } catch (error) {
                console.error('Error fetching pet:', error);
                setMessage({ text: 'Failed to fetch pet details', type: 'error' });
                setOpen(true);
            }
        };
        fetchPet();
    }, [pid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPet(prevPet => ({
            ...prevPet,
            [name]: name === 'age' ? (value === '' ? 0 : parseInt(value))
                  : name === 'weight' ? (value === '' ? 0.0 : parseFloat(value))
                  : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!pet.petName || pet.petName.trim() === '') {
                setMessage({ text: 'Pet name is required', type: 'error' });
                setOpen(true);
                return;
            }

            if (!pet.species || pet.species.trim() === '') {
                setMessage({ text: 'Species is required', type: 'error' });
                setOpen(true);
                return;
            }

            const petUpdateDTO = new PetUpdateDTO(pet);
            const payload = petUpdateDTO.toJSON();
            console.log('Request payload:', payload);

            const response = await fetch(`http://localhost:8080/api/pet/putPetDetails/${pid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(errorText || 'Failed to update pet');
            }

            const result = await response.json();
            console.log('Update response:', result);

            setMessage({ text: 'Pet updated successfully!', type: 'success' });
            setOpen(true);
            
            // Navigate immediately to force a fresh load of the pet list
            navigate('/petlist', { state: { refresh: true } });

        } catch (error) {
            console.error('Error updating pet:', error);
            setMessage({ text: error.message || 'Failed to update pet', type: 'error' });
            setOpen(true);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            <Header onLogout={handleLogout} user={user} />
            <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4, backgroundColor: '#FFBE98' }}>
                    <Typography variant="h4" gutterBottom sx={{ color: '#125B9A', fontWeight: 600, textAlign: 'center' }}>
                        Update Pet
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Pet Name"
                            name="petName"
                            value={pet.petName}
                            onChange={handleChange}
                            margin="normal"
                            required
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Species"
                            name="species"
                            value={pet.species}
                            onChange={handleChange}
                            margin="normal"
                            required
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Breed"
                            name="breed"
                            value={pet.breed}
                            onChange={handleChange}
                            margin="normal"
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Age"
                            name="age"
                            type="number"
                            value={pet.age}
                            onChange={handleChange}
                            margin="normal"
                            inputProps={{ min: 0, step: 1 }}
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Weight"
                            name="weight"
                            type="number"
                            value={pet.weight}
                            onChange={handleChange}
                            margin="normal"
                            inputProps={{ min: 0, step: 0.1 }}
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Medical Records"
                            name="medRec"
                            value={pet.medRec}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={4}
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        />
                        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    backgroundColor: '#F05A7E',
                                    '&:hover': { backgroundColor: '#d64d6f' }
                                }}
                            >
                                Update Pet
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/petlist')}
                                sx={{
                                    color: '#125B9A',
                                    borderColor: '#125B9A',
                                    '&:hover': {
                                        borderColor: '#0d4372',
                                        backgroundColor: 'rgba(18, 91, 154, 0.04)'
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Paper>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={message.type} sx={{ width: '100%' }}>
                        {message.text}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
}

export default UpdatePet;
