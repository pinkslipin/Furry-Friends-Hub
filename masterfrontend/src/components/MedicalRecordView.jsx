import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Box, Button, Container, Grid2 as Grid, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material'
import Header from './Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MedicalRecordView({ onLogout }) {
    const [pets, setPets] = useState([])
    const [vets, setVets] = useState([])
    const [medRecs, setMedRecs] = useState([])
    const [validation, setValidation] = useState(null)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const [formRecord, setFormRecord] = useState({
        medicalProcedure: "",
        medication: "",
        notes: "",
        recordDate: "",
    })

    const petid = useRef("");
    const vetid = useRef("");
    const navigate = useNavigate();
    const location = useLocation();

    const user = location.state?.user;
    const medRecView = location.state?.medRec;

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    const handleBackToRecords = () => {
        navigate('/medicalrecords', { state: { user } })
    }

    const fetchPets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/pet/getAllPets');
            console.log('Pets fetched:', response.data);
            setPets(response.data);
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    }

    const fetchVets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vet/getAllVets');
            console.log('Vets fetched:', response.data);
            setVets(response.data);
        } catch (error) {
            console.error('Error fetching vets:', error);
        }
    }

    const handleChange = (e) => {
        setFormRecord({ ...formRecord, [e.target.name]: e.target.value });
    };

    const deleteRecord = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/medicalrecords/deleteMedicalRecord/${medRecView.id}`);
            setSnackbar({ open: true, message: 'Medical Record deleted successfully', severity: 'success' });
            setTimeout(() => {
                handleBackToRecords();
            }, 2000); // Ensure the notification stays for at least 3 seconds
        } catch (error) {
            console.error('There was an error!', error);
            setValidation("There is an error inside the database");
            setSnackbar({ open: true, message: 'Failed to delete Medical Record', severity: 'error' });
        }
    }

    const handleDeleteRecord = () => {
        setOpenConfirm(true);
    }

    const handleConfirmClose = (confirmed) => {
        setOpenConfirm(false);
        if (confirmed) {
            deleteRecord();
        }
    }

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    }

    return (
        <>
            <Header onLogout={handleLogoutClick} user={user} />
            <Container maxWidth="md" sx={{ mt: 8, backgroundColor: '#ffc1a8', padding: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton onClick={handleBackToRecords} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ color: '#125B9A', fontWeight: 'bold' }}>Medical Record of Pet {medRecView.pet.petName}</Typography>
                </Box>
                <Box sx={{ backgroundColor: 'white', padding: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <Typography variant="h5" sx={{ color: '#4e342e', fontWeight: 'bold', mb: 2 }}>Medical Record Details</Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Medical Record ID:</strong> {medRecView.id}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Date Recorded:</strong> {medRecView.recordDate}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Medical Procedure:</strong> {medRecView.medicalProcedure}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Medication:</strong> {medRecView.medication}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1"><strong>Notes:</strong> {medRecView.notes}</Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ borderBottom: '2px solid #4e342e', mb: 4 }}></Box>
                    <Typography variant="h5" sx={{ color: '#4e342e', fontWeight: 'bold', mb: 2 }}>Pet Details</Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Pet ID:</strong> {medRecView.pet.pid}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Pet Name:</strong> {medRecView.pet.petName}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Species:</strong> {medRecView.pet.species}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Breed:</strong> {medRecView.pet.breed}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Age:</strong> {medRecView.pet.age}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Weight:</strong> {medRecView.pet.weight}</Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ borderBottom: '2px solid #4e342e', mb: 4 }}></Box>
                    <Typography variant="h5" sx={{ color: '#4e342e', fontWeight: 'bold', mb: 2 }}>Vet Details</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Vet ID:</strong> {medRecView.vet.vetid}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Full Name:</strong> {medRecView.vet.fname} {medRecView.vet.lname}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Specialization:</strong> {medRecView.vet.specialization}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Phone Number:</strong> {medRecView.vet.phoneNum}</Typography>
                        </Grid>
                    </Grid>
                    {user.role === "VET" && (
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" sx={{ backgroundColor: "red" }} onClick={handleDeleteRecord}>Delete Medical Record</Button>
                            {validation != null && <Typography sx={{ color: 'red', mt: 2 }}>{validation}</Typography>}
                        </Box>
                    )}
                </Box>
            </Container>

            <Dialog
                open={openConfirm}
                onClose={() => handleConfirmClose(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete Medical Record ID {medRecView.id}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirmClose(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleConfirmClose(true)} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default MedicalRecordView
