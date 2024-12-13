import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion'; // Add framer-motion

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const hoverEffect = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 }
};

const AppointmentForm = ({ onLogout }) => {
    const [appointmentData, setAppointmentData] = useState({
        appointmentId: '',
        appointmentDate: '',
        appointmentTime: '',
        status: '',
        vetId: '',
        petId: '',
        ownerId: '',
        description: ''
    });
    const [appointments, setAppointments] = useState([]);
    const [vets, setVets] = useState([]);
    const [pets, setPets] = useState([]);
    const [owners, setOwners] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', message: '', action: null, type: '' });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    const fetchAppointments = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/appointments/getAllAppointments');
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments", error);
        }
    }, []);

    const fetchVets = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vet/getAllVets');
            setVets(response.data);
        } catch (error) {
            console.error("Error fetching vets", error);
        }
    }, []);

    const fetchPets = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/pet/getAllPets');
            setPets(response.data);
        } catch (error) {
            console.error("Error fetching pets", error);
        }
    }, []);

    const fetchOwners = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/furryfriendshubowner/getAllOwners');
            setOwners(response.data);
        } catch (error) {
            console.error("Error fetching owners", error);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
        fetchVets();
        fetchPets();
        fetchOwners();
    }, [fetchAppointments, fetchVets, fetchPets, fetchOwners]);

    const handleEditOpen = (appointment) => {
        setAppointmentData({
            ...appointment,
            vetId: appointment.vet?.vetid || '',
            petId: appointment.pet?.pid || '',
            ownerId: appointment.pet?.owner?.ownerId || '',
        });
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        resetForm();
    };

    const handleAddOpen = () => setAddOpen(true);
    const handleAddClose = () => setAddOpen(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to ${value}`);
        setAppointmentData(prevState => ({
            ...prevState,
            [name]: value || ''
        }));
    
        if (name === 'petId') {
            const selectedPet = pets.find(pet => pet.pid === parseInt(value));
            if (selectedPet) {
                setAppointmentData(prevState => ({
                    ...prevState,
                    ownerId: selectedPet.owner?.ownerId || ''
                }));
            }
        }
    }, [pets]);

    const handleDialogOpen = useCallback((title, message, action, type) => {
        setDialogContent({ title, message, action, type });
        setOpenDialog(true);
    }, []);

    const handleDialogClose = useCallback((confirmed) => {
        setOpenDialog(false);
        if (confirmed && dialogContent.action) {
            dialogContent.action();
        }
    }, [dialogContent]);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        const appointmentToSend = {
            ...appointmentData,
            vetId: parseInt(appointmentData.vetId) || 0,
            petId: parseInt(appointmentData.petId) || 0,
            ownerId: parseInt(appointmentData.ownerId) || 0,
            description: appointmentData.description
        };

        try {
            await axios.post('http://localhost:8080/api/appointments/postAppointment', appointmentToSend, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setSnackbarMessage("Appointment created successfully!");
            setOpenSnackbar(true);
            fetchAppointments();
            resetForm();
            handleAddClose();
        } catch (error) {
            console.error("Error creating appointment!", error);
        }
    }, [appointmentData, fetchAppointments]);

    const handleEdit = useCallback(async (event) => {
        event.preventDefault();
        handleDialogOpen("Update Appointment", "Are you sure you want to update this appointment?", async () => {
            const appointmentToSend = {
                ...appointmentData,
                vetId: parseInt(appointmentData.vetId) || 0,
                petId: parseInt(appointmentData.petId) || 0,
                ownerId: parseInt(appointmentData.ownerId) || 0,
                description: appointmentData.description
            };

            try {
                await axios.put(`http://localhost:8080/api/appointments/putAppointmentDetails/${appointmentData.appointmentId}`, appointmentToSend, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                setSnackbarMessage("Appointment updated successfully!");
                setOpenSnackbar(true);
                fetchAppointments();
                resetForm();
                handleEditClose();
            } catch (error) {
                console.error("Error updating appointment!", error);
            }
        }, );
    }, [appointmentData, fetchAppointments, handleDialogOpen]);

    const handleDelete = useCallback(async (appointmentId) => {
        handleDialogOpen("Delete Appointment", "Are you sure you want to delete this appointment?", async () => {
            try {
                await axios.delete(`http://localhost:8080/api/appointments/deleteAppointmentDetails/${appointmentId}`);
                setSnackbarMessage('Appointment deleted successfully!');
                setOpenSnackbar(true);
                fetchAppointments();
            } catch (error) {
                console.error("Error deleting appointment!", error);
            }
        }, 'delete');
    }, [fetchAppointments, handleDialogOpen]);

    const handleConfirm = useCallback(async (appointmentId) => {
        handleDialogOpen("Confirm Appointment", "Are you sure you want to confirm this appointment?", async () => {
            try {
                await axios.put(`http://localhost:8080/api/appointments/confirmAppointment/${appointmentId}`, null, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setSnackbarMessage("Appointment confirmed successfully!");
                setOpenSnackbar(true);
                fetchAppointments();
            } catch (error) {
                console.error("Error confirming appointment!", error);
            }
        }, 'confirm');
    }, [fetchAppointments, handleDialogOpen]);

    const resetForm = useCallback(() => {
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
    }, []);

    const handleBack = useCallback(() => {
        navigate('/vethome');
    }, [navigate]);

    const handleLogoutClick = useCallback(() => {
        onLogout();
        navigate('/login');
    }, [navigate, onLogout]);

    const handleSnackbarClose = useCallback(() => {
        setOpenSnackbar(false);
    }, []);

    const today = useMemo(() => new Date(), []);
    const tomorrow = useMemo(() => {
        const date = new Date(today);
        date.setDate(date.getDate() + 1);
        return date;
    }, [today]);
    const minDate = useMemo(() => tomorrow.toISOString().split('T')[0], [tomorrow]);

    const modalStyles = useMemo(() => ({
        dialogTitle: {
            backgroundColor: '#125B9A',
            color: 'white',
            cursor: 'move'
        },
        dialogTitle2: {
            backgroundColor: '#F05A7E',
            color: 'white',
            cursor: 'move'
        },
        dialogTitle3: {
            backgroundColor: '#28a745',
            color: 'white',
            cursor: 'move'
        },
        dialogContent: {
            padding: '20px'
        },
        dialogActions: {
            padding: '10px 20px'
        },
        button: {
            backgroundColor: '#F05A7E',
            color: 'white',
            '&:hover': {
                backgroundColor: '#d64d6f'
            }
        },
        button2: {
            backgroundColor: '#125B9A',
            color: 'white',
            '&:hover': {
                backgroundColor: '#125B9A'
            }
        },
        button3: {
            backgroundColor: '#28a745',
            color: 'white',
            '&:hover': {
                backgroundColor: '#218838'
            }
        }
    }), []);

    const PaperComponent = useCallback((props) => {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"], [class*="MuiDialogActions-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }, []);

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                    <motion.div {...fadeIn} transition={{ delay: 0.2 }} {...hoverEffect}>
                        <Button variant="contained" onClick={handleAddOpen} sx={{ 
                            mb: 2,
                            backgroundColor: '#F05A7E',
                            '&:hover': { backgroundColor: '#d64d6f' },
                            borderRadius: '5px',
                            color: 'white',
                            padding: '8px 16px' }}>
                            Add Appointment
                        </Button>
                    </motion.div>
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
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Description</TableCell> {/* New column */}
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
                                    <TableCell>{appointment.description}</TableCell> {/* New column */}
                                    <TableCell>
                                        <motion.div {...fadeIn} transition={{ delay: 0.2 }} {...hoverEffect}>
                                            <IconButton onClick={() => handleEditOpen(appointment)}>
                                                <EditIcon style={{ color: "#125B9A" }} />
                                            </IconButton>
                                        </motion.div>
                                        <motion.div {...fadeIn} transition={{ delay: 0.2 }} {...hoverEffect}>
                                            <IconButton onClick={() => handleDelete(appointment.appointmentId)}>
                                                <DeleteIcon style={{ color: "#F05A7E" }} />
                                            </IconButton>
                                        </motion.div>
                                        {appointment.status === 'pending' && (
                                            <motion.div {...fadeIn} transition={{ delay: 0.2 }} {...hoverEffect}>
                                                <IconButton onClick={() => handleConfirm(appointment.appointmentId)}>
                                                    <CheckCircleIcon style={{ color: "#28a745" }} />
                                                </IconButton>
                                            </motion.div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Dialog open={addOpen} onClose={handleAddClose} PaperComponent={PaperComponent}>
                <DialogTitle style={modalStyles.dialogTitle2} id="draggable-dialog-title">Add Appointment</DialogTitle>
                <DialogContent style={modalStyles.dialogContent}>
                    <form onSubmit={handleSubmit}>
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
                                    value={appointmentData.description || ''} // Ensure this is controlled by state
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
                            <input type="hidden" name="ownerId" value={appointmentData.ownerId || ''} />
                        </Grid>
                        <DialogActions style={modalStyles.dialogActions}>
                            <Button onClick={handleAddClose} style={modalStyles.button}>
                                Cancel
                            </Button>
                            <Button type="submit" style={modalStyles.button}>
                                Add
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={editOpen} onClose={handleEditClose} PaperComponent={PaperComponent}>
                <DialogTitle style={modalStyles.dialogTitle} id="draggable-dialog-title">Update Appointment</DialogTitle>
                <DialogContent style={modalStyles.dialogContent}>
                    <form onSubmit={handleEdit}>
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
                                    value={appointmentData.description || ''} // Ensure this is controlled by state
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
                            <input type="hidden" name="ownerId" value={appointmentData.ownerId || ''} />
                        </Grid>
                        <DialogActions style={modalStyles.dialogActions}>
                            <Button onClick={handleEditClose} style={modalStyles.button2}>
                                Cancel
                            </Button>
                            <Button type="submit" style={modalStyles.button2}>
                                Update
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={openDialog} onClose={() => handleDialogClose(false)} PaperComponent={PaperComponent}>
                <DialogTitle style={dialogContent.type === 'delete' ? modalStyles.dialogTitle2 : dialogContent.type === 'confirm' ? modalStyles.dialogTitle3 : modalStyles.dialogTitle} id="draggable-dialog-title">{dialogContent.title}</DialogTitle>
                <DialogContent style={modalStyles.dialogContent}>
                    <DialogContentText>{dialogContent.message}</DialogContentText>
                </DialogContent>
                <DialogActions style={modalStyles.dialogActions}>
                    <Button onClick={() => handleDialogClose(false)} style={dialogContent.type === 'delete' ? modalStyles.button : dialogContent.type === 'confirm' ? modalStyles.button3 : modalStyles.button2}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleDialogClose(true)} style={dialogContent.type === 'delete' ? modalStyles.button : dialogContent.type === 'confirm' ? modalStyles.button3 : modalStyles.button2}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AppointmentForm;