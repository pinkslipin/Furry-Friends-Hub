import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Grid, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AppointmentForm = () => {
    const [appointmentData, setAppointmentData] = useState({
        appointmentId: '',
        appointmentDate: '',
        appointmentTime: '',
        status: '',
        vetId: '',
        petId: '',
        billingId: '',
        billingDate: '',
        amountDue: '',
        amountPaid: ''
    });
    const [notification, setNotification] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [vets, setVets] = useState([]);
    const [pets, setPets] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
        fetchVets();
        fetchPets();
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

    const handleEdit = (appointment) => {
        setAppointmentData({
            ...appointment,
            vetId: appointment.vet?.vetid || '',
            petId: appointment.pet?.pid || '',
            // billingId: appointment.billing?.billingId || '',
            // billingDate: appointment.billing?.billingDate || '',
            // amountDue: appointment.billing?.amountDue || '',
            // amountPaid: appointment.billing?.amountPaid || ''
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const appointmentToSend = {
            ...appointmentData,
            vetId: parseInt(appointmentData.vetId),
            petId: parseInt(appointmentData.petId),
            // amountDue: parseFloat(appointmentData.amountDue),
            // amountPaid: parseFloat(appointmentData.amountPaid)
        };

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

        // const billingToSend = {
        //     billingDate: appointmentData.billingDate,
        //     amountDue: parseFloat(appointmentData.amountDue),
        //     amountPaid: parseFloat(appointmentData.amountPaid)
        // };

        const appointmentToSend = {
            ...appointmentData,
            vetId: parseInt(appointmentData.vetId),
            petId: parseInt(appointmentData.petId)
        };

        try {
            // Update billing data
            // await axios.put(`http://localhost:8080/api/billing/putBillingDetails/${appointmentData.billingId}`, billingToSend, {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });

            // Update appointment data
            await axios.put(`http://localhost:8080/api/appointments/putAppointmentDetails/${appointmentData.appointmentId}?petId=${appointmentData.petId}&vetId=${appointmentData.vetId}`, appointmentToSend, {
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

    const resetForm = () => {
        setAppointmentData({
            appointmentId: '',
            appointmentDate: '',
            appointmentTime: '',
            status: '',
            vetId: '',
            petId: '',
            // billingId: '',
            // billingDate: '',
            // amountDue: '',
            // amountPaid: ''
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Get tomorrow's date in the required format
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Box sx={{ position: 'relative', mt: 4 }}>
                <IconButton onClick={handleBack} sx={{ position: 'absolute', top: 1, left: -3 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" align="center" gutterBottom>
                    {isEditing ? 'Edit Appointment' : 'Add Appointment'}
                </Typography>
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
                                value={appointmentData.appointmentDate}
                                InputLabelProps={{ shrink: true }}
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
                                value={appointmentData.appointmentTime}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="text"
                                name="status"
                                label="Status"
                                variant="outlined"
                                margin="normal"
                                onChange={handleChange}
                                value={appointmentData.status}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" margin="normal" required>
                                <InputLabel>Vet</InputLabel>
                                <Select
                                    name="vetId"
                                    value={appointmentData.vetId}
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
                                    value={appointmentData.petId}
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
                        {/* <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="date"
                                name="billingDate"
                                label="Billing Date"
                                variant="outlined"
                                margin="normal"
                                onChange={handleChange}
                                value={appointmentData.billingDate}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="amountDue"
                                label="Amount Due"
                                variant="outlined"
                                margin="normal"
                                onChange={handleChange}
                                value={appointmentData.amountDue}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="amountPaid"
                                label="Amount Paid"
                                variant="outlined"
                                margin="normal"
                                onChange={handleChange}
                                value={appointmentData.amountPaid}
                                required
                            />
                        </Grid> */}
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
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
                <Button onClick={handleBack} variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Back to Home
                </Button>
                <Typography variant="h5" align="center" sx={{ mt: 4 }}>Appointments List</Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {appointments.map((appointment) => (
                        <Grid item xs={12} key={appointment.appointmentId}>
                            <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                                <Typography variant="body1">
                                    {appointment.appointmentDate} {appointment.appointmentTime} - {appointment.status}
                                </Typography>
                                <Typography variant="body2">
                                    Veterinarian: {appointment.vet ? `${appointment.vet.fname} ${appointment.vet.lname}` : 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                    Pet: {appointment.pet ? `${appointment.pet.petName} (ID: ${appointment.pet.pid})` : 'N/A'}
                                </Typography>
                                {/* <Typography variant="body2">
                                    Billing Date: {appointment.billing ? appointment.billing.billingDate : 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                    Amount Due: {appointment.billing ? appointment.billing.amountDue : 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                    Amount Paid: {appointment.billing ? appointment.billing.amountPaid : 'N/A'}
                                </Typography> */}
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="outlined" color="primary" onClick={() => handleEdit(appointment)}>
                                        Edit
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(appointment.appointmentId)}>
                                        Delete
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default AppointmentForm;