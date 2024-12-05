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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    IconButton
} from '@mui/material';
import Header from './Header';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdoptionAnimalList = ({ user, onLogout }) => {
    const [animals, setAnimals] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        animalName: '',
        species: '',
        breed: '',
        age: '',
        status: 'Available',
        sex: ''
    });
    const [editOpen, setEditOpen] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [image, setImage] = useState(null);

    const fetchAnimals = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/adoption/animals/list');
            setAnimals(response.data);
        } catch (error) {
            console.error('Error fetching animals:', error);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/adoption/animals/register', {
                animalname: formData.animalName,    // match backend field names
                species: formData.species,
                breed: formData.breed,
                age: parseInt(formData.age),
                status: formData.status,
                sex: formData.sex,
                image: image ? image.split(',')[1] : null // Remove the base64 prefix
            });
            handleClose();
            await fetchAnimals(); // Await the refresh
            setFormData({
                animalName: '',
                species: '',
                breed: '',
                age: '',
                status: 'Available',
                sex: ''
            });
            setImage(null);
        } catch (error) {
            console.error('Error adding animal:', error);
            alert('Failed to add animal. Please try again.');
        }
    };

    const handleEditOpen = (animal) => {
        setSelectedAnimal(animal);
        setFormData({
            animalName: animal.animalname,
            species: animal.species,
            breed: animal.breed,
            age: animal.age.toString(),
            status: animal.status,
            sex: animal.sex
        });
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setSelectedAnimal(null);
    };

    const handleDeleteOpen = (animal) => {
        setSelectedAnimal(animal);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
        setSelectedAnimal(null);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/adoption/animals/update/${selectedAnimal.animalid}`, {
                animalname: formData.animalName,
                species: formData.species,
                breed: formData.breed,
                age: parseInt(formData.age),
                status: formData.status,
                sex: formData.sex,
                image: image ? image.split(',')[1] : selectedAnimal.image // Use new image if available
            });
            handleEditClose();
            await fetchAnimals();
        } catch (error) {
            console.error('Error updating animal:', error);
            alert('Failed to update animal. Please try again.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/adoption/animals/remove/${selectedAnimal.animalid}`);
            handleDeleteClose();
            await fetchAnimals();
        } catch (error) {
            console.error('Error deleting animal:', error);
            alert('Failed to delete animal. Please try again.');
        }
    };

    return (
        <Container>
            <Header onLogout={onLogout} user={user} />
            <Box sx={{ mt: 10, mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Adoption Animals
                </Typography>
                <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
                    Add New Animal
                </Button>
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
                            <TableCell>Actions</TableCell>
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
                                <TableCell>{animal.status}</TableCell>
                                <TableCell>
                                    {animal.image && <img src={`data:image/jpeg;base64,${animal.image}`} alt={animal.animalname} width="100" />}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditOpen(animal)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteOpen(animal)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Animal</DialogTitle>
                <DialogContent>
                    <TextField
                        name="animalName"
                        label="Animal Name"
                        fullWidth
                        margin="normal"
                        value={formData.animalName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="species"
                        label="Species"
                        fullWidth
                        margin="normal"
                        value={formData.species}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="breed"
                        label="Breed"
                        fullWidth
                        margin="normal"
                        value={formData.breed}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="age"
                        label="Age"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.age}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="sex"
                        label="Sex"
                        fullWidth
                        margin="normal"
                        value={formData.sex}
                        onChange={handleInputChange}
                    />
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Animal</DialogTitle>
                <DialogContent>
                    <TextField
                        name="animalName"
                        label="Animal Name"
                        fullWidth
                        margin="normal"
                        value={formData.animalName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="species"
                        label="Species"
                        fullWidth
                        margin="normal"
                        value={formData.species}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="breed"
                        label="Breed"
                        fullWidth
                        margin="normal"
                        value={formData.breed}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="age"
                        label="Age"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.age}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="sex"
                        label="Sex"
                        fullWidth
                        margin="normal"
                        value={formData.sex}
                        onChange={handleInputChange}
                    />
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleEdit}>Update</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteOpen} onClose={handleDeleteClose}>
                <DialogTitle>Delete Animal</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {selectedAnimal?.animalname}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdoptionAnimalList;