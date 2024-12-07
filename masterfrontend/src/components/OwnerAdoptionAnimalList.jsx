import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button
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
        <Container>
            <Header onLogout={onLogout} user={user} />
            <Box sx={{ mt: 10, mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Animals Available for Adoption
                </Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Species</TableCell>
                            <TableCell>Breed</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Sex</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Weight</TableCell>
                            <TableCell>Medical Record</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {animals.map((animal) => (
                            <TableRow key={animal.animalid}>
                                <TableCell>{animal.animalname}</TableCell>
                                <TableCell>{animal.species}</TableCell>
                                <TableCell>{animal.breed}</TableCell>
                                <TableCell>{animal.age}</TableCell>
                                <TableCell>{animal.sex}</TableCell>
                                <TableCell>
                                    {animal.status.toLowerCase() === 'available' ? 'Available' : 'Adopted'}
                                </TableCell>
                                <TableCell>
                                    {animal.image && <img src={`data:image/jpeg;base64,${animal.image}`} alt={animal.animalname} width="100" />}
                                </TableCell>
                                <TableCell>{animal.weight}</TableCell>
                                <TableCell>{animal.medRec}</TableCell>
                                <TableCell>
                                    {animal.status.toLowerCase() === 'available' && (
                                        <Button variant="contained" color="primary" onClick={() => handleAdopt(animal.animalid)}>
                                            Adopt
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default OwnerAdoptionAnimalList;

//ang needed nlng i change kay ang photo nga naas adoption animal list kay dili ma display sa pet record og ang medical condition ma changed to
// sa pet record once ma adopt ang pet.