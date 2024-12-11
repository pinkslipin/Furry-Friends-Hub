import { Box, Button, Card, CardContent, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

const AppointmentForm = ({ onLogout }) => {
    const [appointmentData, setAppointmentData] = useState({
        appointmentId: '',
        appointmentDate: '',
        appointmentTime: '',
        status: '',
        vetId: '',
        petId: '',
        ownerId: '',
        billingId: '',
        billingDate: '',
        amountDue: '',
        amountPaid: '',
        description: ''
    });
    const [notification, setNotification] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [vets, setVets] = useState([]);
    const [pets, setPets] = useState([]);
    const [owners, setOwners] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    useEffect(() => {
        fetchAppointments();
        fetchVets();
        fetchPets();
        fetchOwners();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/appointments/getAllAppointments');
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments", error);
            setNotification("Error fetching appointments.");
        }
    };

    const fetchVets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vet/getAllVets');
            setVets(response.data);
        } catch (error) {
            console.error("Error fetching vets", error);
            setNotification("Error fetching veterinarians.");
        }
    };

    const fetchPets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/pet/getAllPets');
            setPets(response.data);
        } catch (error) {
            console.error("Error fetching pets", error);
            setNotification("Error fetching pets.");
        }
    };

    const fetchOwners = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/furryfriendshubowner/getAllOwners');
            setOwners(response.data);
        } catch (error) {
            console.error("Error fetching owners", error);
            setNotification("Error fetching owners.");
        }
    };

    const handleEdit = (appointment) => {
        setAppointmentData({
            ...appointment,
            vetId: appointment.vet?.vetid || '',
            petId: appointment.pet?.pid || '',
            ownerId: appointment.pet?.owner?.ownerId || '',
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData(prevState => ({
            ...prevState,
            [name]: value || ''
        }));

        // If the pet is selected, update the owner based on the pet's ownerId
        if (name === 'petId') {
            const selectedPet = pets.find(pet => pet.pid === parseInt(value));
            if (selectedPet) {
                console.log('Selected Pet:', selectedPet);
                setAppointmentData(prevState => ({
                    ...prevState,
                    ownerId: selectedPet.owner?.ownerId || ''
                }));
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!window.confirm("Are you sure you want to create this appointment?")) return;

        const appointmentToSend = {
            ...appointmentData,
            vetId: parseInt(appointmentData.vetId) || 0,
            petId: parseInt(appointmentData.petId) || 0,
            ownerId: parseInt(appointmentData.ownerId) || 0,
            description: appointmentData.description
        };

        console.log('Appointment to Send:', appointmentToSend);

        try {
            await axios.post('http://localhost:8080/api/appointments/postAppointment', appointmentToSend, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setNotification("Appointment created successfully!");
            fetchAppointments();
            resetForm();
        } catch (error) {
            console.error("Error creating appointment!", error);
            setNotification("Error creating appointment.");
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!window.confirm("Are you sure you want to update this appointment?")) return;

        const appointmentToSend = {
            ...appointmentData,
            vetId: parseInt(appointmentData.vetId) || 0,
            petId: parseInt(appointmentData.petId) || 0,
            ownerId: parseInt(appointmentData.ownerId) || 0,
            description: appointmentData.description
        };

        console.log('Appointment to Update:', appointmentToSend);

        try {
            await axios.put(`http://localhost:8080/api/appointments/putAppointmentDetails/${appointmentData.appointmentId}`, appointmentToSend, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setNotification("Appointment updated successfully!");
            fetchAppointments();
            resetForm();
        } catch (error) {
            console.error("Error updating appointment!", error);
            setNotification("Error updating appointment.");
        }
    };

    const handleDelete = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to delete this appointment?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/appointments/deleteAppointmentDetails/${appointmentId}`);
            setNotification('Appointment deleted successfully!');
            fetchAppointments();
        } catch (error) {
            console.error("Error deleting appointment!", error);
            setNotification("Error deleting appointment.");
        }
    };

    const handleConfirm = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to confirm this appointment?")) return;

        try {
            await axios.put(`http://localhost:8080/api/appointments/confirmAppointment/${appointmentId}`, null, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setNotification("Appointment confirmed successfully!");
            fetchAppointments();
        } catch (error) {
            console.error("Error confirming appointment!", error);
            setNotification("Error confirming appointment.");
        }
    };

    const resetForm = () => {
        setAppointmentData({
            appointmentId: '',
            appointmentDate: '',
            appointmentTime: '',
            status: '',
            vetId: '',
            petId: '',
            ownerId: '',
            description: ''
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleBack = () => {
        navigate('/vethome');
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    // Get tomorrow's date in the required format
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <Container maxWidth="lg" sx={{ mt: 8 }}>
            <Header onLogout={handleLogoutClick} user={user} />
            <Box sx={{ position: 'relative', mt: 4 }}>
                <IconButton onClick={handleBack} sx={{ position: 'absolute', top: 1, left: -3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" style={{ color: "#125B9A", fontWeight: 600 }}>
                        Appointments List
                    </Typography>
                </Box>
                <TableContainer component={Paper} style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
                    <Table>
                        <TableHead style={{ backgroundColor: "#FFBE98" }}>
                            <TableRow>
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Date</TableCell>
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Time</TableCell>
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Status</TableCell>
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Veterinarian</TableCell>
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Pet</TableCell>
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map((appointment, index) => (
                                <TableRow key={appointment.appointmentId} style={{ backgroundColor: index % 2 === 0 ? "#FFF5EC" : "white" }}>
                                    <TableCell>{appointment.appointmentDate}</TableCell>
                                    <TableCell>{appointment.appointmentTime}</TableCell>
                                    <TableCell>{appointment.status}</TableCell>
                                    <TableCell>
                                        {appointment.vet ? `${appointment.vet.fname} ${appointment.vet.lname}` : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {appointment.pet ? `${appointment.pet.petName} (ID: ${appointment.pet.pid})` : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="primary" onClick={() => handleEdit(appointment)} style={{ marginRight: "10px", borderRadius: "5px", color: "#125B9A", borderColor: "#125B9A" }}>
                                            Edit
                                        </Button>
                                        <Button variant="outlined" color="secondary" onClick={() => handleDelete(appointment.appointmentId)} style={{ marginRight: "10px", borderRadius: "5px", color: "#F05A7E", borderColor: "#F05A7E" }}>
                                            Delete
                                        </Button>
                                        {appointment.status === 'pending' && (
                                            <Button variant="outlined" color="success" onClick={() => handleConfirm(appointment.appointmentId)} style={{ borderRadius: "5px", color: "#28a745", borderColor: "#28a745" }}>
                                                Confirm
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                    <Typography variant="h4" style={{ color: "#125B9A", fontWeight: 600 }}>
                        Add Appointment
                    </Typography>
                </Box>
                <Card sx={{ mt: 2, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        name="appointmentDate"
                                        label="Date"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={appointmentData.appointmentDate || ''}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ min: minDate }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="time"
                                        name="appointmentTime"
                                        label="Time"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={appointmentData.appointmentTime || ''}
                                        InputLabelProps={{ shrink: true }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" margin="normal" required>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            name="status"
                                            value={appointmentData.status || ''}
                                            onChange={handleChange}
                                            label="Status"
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="approved">Approved</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        name="description"
                                        label="Description"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={appointmentData.description || ''}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" margin="normal" required>
                                        <InputLabel>Vet</InputLabel>
                                        <Select
                                            name="vetId"
                                            value={appointmentData.vetId || ''}
                                            onChange={handleChange}
                                            label="Vet"
                                        >
                                            <MenuItem value=""><em>Select Vet</em></MenuItem>
                                            {vets.map(vet => (
                                                <MenuItem key={vet.vetid} value={vet.vetid}>
                                                    {vet.fname} {vet.lname} - {vet.specialization}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" margin="normal" required>
                                        <InputLabel>Pet</InputLabel>
                                        <Select
                                            name="petId"
                                            value={appointmentData.petId || ''}
                                            onChange={handleChange}
                                            label="Pet"
                                        >
                                            <MenuItem value=""><em>Select Pet</em></MenuItem>
                                            {pets.map(pet => (
                                                <MenuItem key={pet.pid} value={pet.pid}>
                                                    {pet.petName} (ID: {pet.pid})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {/* Hidden field for ownerId */}
                                <input type="hidden" name="ownerId" value={appointmentData.ownerId || ''} />
                            </Grid>
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, backgroundColor: '#125B9A', '&:hover': { backgroundColor: '#0e4a7a' } }}>
                                {isEditing ? 'Update Appointment' : 'Create Appointment'}
                            </Button>
                            {isEditing && (
                                <Button type="button" variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleCancel}>
                                    Cancel
                                </Button>
                            )}
                        </form>
                        {notification && (
                            <Typography color="error" align="center" sx={{ mt: 1 }}>
                                {notification}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default AppointmentForm;