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
    Avatar,
    IconButton,
    Snackbar,
    Alert
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
        sex: '',
        weight: '',
        medRec: ''
    });
    const [editOpen, setEditOpen] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

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
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await axios.post('http://localhost:8080/api/adoption/animals/register', {
                animalname: formData.animalName,    // match backend field names
                species: formData.species,
                breed: formData.breed,
                age: parseInt(formData.age),
                status: formData.status,
                sex: formData.sex,
                weight: formData.weight ? parseFloat(formData.weight) : null, // Handle null weight
                medRec: formData.medRec,
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
                sex: '',
                weight: '',
                medRec: ''
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
            sex: animal.sex,
            weight: animal.weight,
            medRec: animal.medRec
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
        e.preventDefault(); // Prevent default form submission
        try {
            await axios.put(`http://localhost:8080/api/adoption/animals/update/${selectedAnimal.animalid}`, {
                animalname: formData.animalName,
                species: formData.species,
                breed: formData.breed,
                age: parseInt(formData.age),
                status: formData.status,
                sex: formData.sex,
                weight: formData.weight ? parseFloat(formData.weight) : null, // Handle null weight
                medRec: formData.medRec,
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

    const handleConfirmAdoption = async (animalId) => {
        try {
            await axios.post(`http://localhost:8080/api/adoption/animals/confirm/${animalId}`);
            fetchAnimals();
            setNotification({ open: true, message: 'Adoption confirmed successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error confirming adoption:', error);
            setNotification({ open: true, message: 'Failed to confirm adoption.', severity: 'error' });
        }
    };

    const handleRejectAdoption = async (animalId) => {
        try {
            await axios.post(`http://localhost:8080/api/adoption/animals/reject/${animalId}`);
            fetchAnimals();
            setNotification({ open: true, message: 'Adoption request rejected.', severity: 'success' });
        } catch (error) {
            console.error('Error rejecting adoption:', error);
            setNotification({ open: true, message: 'Failed to reject adoption.', severity: 'error' });
        }
    };

    const handleCloseNotification = () => {
        setNotification({ open: false, message: '', severity: 'success' });
    };

    return (
        <Container
            style={{
            fontFamily: "Poppins, sans-serif",
            }}>
            <Header onLogout={onLogout} user={user} />
            <Box sx={{ mt: 10, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom style={{ color: "#125B9A", fontWeight: 600 }}>
                    Adoption Animals
                </Typography>
                <Button variant="contained" onClick={handleOpen} sx={{ 
                    mb: 2,
                    backgroundColor: '#F05A7E',
                    '&:hover': { backgroundColor: '#d64d6f' },
                    borderRadius: '5px',
                    color: 'white',
                    padding: '8px 16px' }}>
                    Add New Animal
                </Button>
            </Box>

            <TableContainer component={Paper} style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
                <Table>
                    <TableHead style={{ backgroundColor: "#FFBE98" }}>
                        <TableRow>
                            <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Image</TableCell>
                            <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Name</TableCell>
                            <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Species</TableCell>
                            <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Breed</TableCell>
                            <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Age</TableCell>
                            <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Gender</TableCell>
                            <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Status</TableCell>
                            <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Weight</TableCell>
                            <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Medical Condition</TableCell>
                            <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {Array.isArray(animals) &&animals.length > 0 ? (
                        animals.map((animal, index) => (
                            <TableRow key={animal.animalid} style={{ backgroundColor: index % 2 === 0 ? "#FFF5EC" : "white" }}>
                                <TableCell>
                                    {animal.image && (
                                        <Avatar
                                        src={`data:image/jpeg;base64,${animal.image}`}
                                        alt={animal.animalname}
                                        variant="rounded"
                                        sx={{ width: 56, height: 56 }}
                                      />
                                    )}
                                </TableCell> 
                                <TableCell>{animal.animalname}</TableCell>  
                                <TableCell>{animal.species}</TableCell>
                                <TableCell>{animal.breed}</TableCell>
                                <TableCell>{animal.age}</TableCell>
                                <TableCell>{animal.sex}</TableCell>
                                <TableCell>
                                    {animal.status.toLowerCase() === 'available' ? 'Available' :
                                    animal.status.toLowerCase() === 'adoption pending' ? 'Awaiting Adoption' : 'Adopted'}
                                </TableCell>
                                <TableCell>{animal.weight}</TableCell>
                                <TableCell>{animal.medRec}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditOpen(animal)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteOpen(animal)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    {animal.status.toLowerCase() === 'adoption pending' && (
                                        <>
                                            <Button onClick={() => handleConfirmAdoption(animal.animalid)}>Confirm</Button>
                                            <Button onClick={() => handleRejectAdoption(animal.animalid)}>Reject</Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) 
                    ) : (
                        <TableRow>
                            <TableCell align="center" colSpan={10}>
                                <Typography variant="body1">No pets found</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Animal</DialogTitle>
                <DialogContent>
                    <Box display="flex" justifyContent="center" mb={2}>
                        {image ? (
                            <img src={image} alt="Animal" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                        ) : (
                            <Typography variant="body1">No profile picture</Typography>
                        )}
                    </Box>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Button variant="contained" component="label">
                            Upload Picture
                            <input type="file" hidden onChange={handleImageChange} />
                        </Button>
                    </Box>
                    <TextField
                        name="animalName"
                        label="Animal Name"
                        fullWidth
                        margin="normal"
                        value={formData.animalName}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="species"
                        label="Species"
                        fullWidth
                        margin="normal"
                        value={formData.species}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="breed"
                        label="Breed"
                        fullWidth
                        margin="normal"
                        value={formData.breed}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="age"
                        label="Age"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.age}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="sex"
                        label="Gender"
                        fullWidth
                        margin="normal"
                        value={formData.sex}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="weight"
                        label="Weight"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.weight}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="medRec"
                        label="Medical Condition"
                        fullWidth
                        margin="normal"
                        value={formData.medRec}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" autoFocus>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Animal</DialogTitle>
                <DialogContent>
                    <Box display="flex" justifyContent="center" mb={2}>
                        {image ? (
                            <img src={image} alt="Animal" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                        ) : (
                            <Typography variant="body1">No profile picture</Typography>
                        )}
                    </Box>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Button variant="contained" component="label">
                            Upload Picture
                            <input type="file" hidden onChange={handleImageChange} />
                        </Button>
                    </Box>
                    <TextField
                        name="animalName"
                        label="Animal Name"
                        fullWidth
                        margin="normal"
                        value={formData.animalName}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="species"
                        label="Species"
                        fullWidth
                        margin="normal"
                        value={formData.species}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="breed"
                        label="Breed"
                        fullWidth
                        margin="normal"
                        value={formData.breed}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="age"
                        label="Age"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.age}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="sex"
                        label="Sex"
                        fullWidth
                        margin="normal"
                        value={formData.sex}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="weight"
                        label="Weight"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.weight}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="medRec"
                        label="Medical Record"
                        fullWidth
                        margin="normal"
                        value={formData.medRec}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEdit} color="primary" autoFocus>
                        Update
                    </Button>
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

            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdoptionAnimalList;