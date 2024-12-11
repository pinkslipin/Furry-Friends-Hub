import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Box, Button, Container, FormControl, Grid2 as Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography, Snackbar, Alert } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField, DatePicker } from '@mui/x-date-pickers'
import Header from './Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MedicalRecordAdd({ onLogout }) {
    const [pets, setPets] = useState([])
    const [vets, setVets] = useState([])
    const [validation, setValidation] = useState({ message: "", success: null })
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const dateToday = new Date().toISOString().substring(0, 10)

    const [formRecord, setFormRecord] = useState({
        medicalProcedure: "",
        medication: "",
        notes: "",
        recordDate: dateToday,
    })

    const [petid, setPetId] = useState('');
    const [vetid, setVetId] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    const handleBackToRecords = () => {
        navigate('/medicalrecords', { state: { user } })
    }

    useEffect(() => {
        fetchPets()
        fetchVets()
    }, [])

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

    const addMedRec = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(`http://localhost:8080/api/medicalrecords/postMedicalRecord/?petid=${petid}&vetid=${vetid}`, formRecord);
            setSnackbar({ open: true, message: 'Medical Record added successfully', severity: 'success' });
        } catch (error) {
            console.error('There was an error!', error);
            setSnackbar({ open: true, message: 'Failed to add Medical Record', severity: 'error' });
        }
    }

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    }

    return (
        <>
            <Header onLogout={handleLogoutClick} user={user} />
            <Container maxWidth="md" sx={{ mt: 8, backgroundColor: 'beige', padding: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <IconButton onClick={handleBackToRecords} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ color: '#125B9A', fontWeight: 'bold' }}>Add Medical Record</Typography>
                </Box>
                <Box sx={{ backgroundColor: 'white', padding: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <form onSubmit={addMedRec}>
                        <TextField fullWidth margin='normal' type='text' name="medicalProcedure" label='Medical Procedure' required onChange={handleChange} />
                        <TextField fullWidth margin='normal' multiline type='text' name='medication' label='Medication' required onChange={handleChange} />
                        <TextField fullWidth margin='normal' multiline type='text' name='notes' label='Notes' onChange={handleChange} />
                        <TextField fullWidth margin='normal' type='date' name="recordDate" label='Record Date' defaultValue={dateToday} slotProps={{ min: `${dateToday}` }} variant='outlined' required onChange={handleChange} />

                        <TextField fullWidth margin='normal' select label="Pet Name" required value={petid} onChange={(e) => setPetId(e.target.value)}>
                            {pets.map((pet, i) => (
                                <MenuItem key={i} value={pet.pid}>{pet.petName}</MenuItem>
                            ))}
                        </TextField>

                        <TextField fullWidth margin='normal' select label="Vet Name" required value={vetid} onChange={(e) => setVetId(e.target.value)}>
                            {vets.map((vet, i) => (
                                <MenuItem key={i} value={vet.vetid}>{vet.fname} {vet.lname}</MenuItem>
                            ))}
                        </TextField>

                        <Button type='submit' variant='contained' sx={{ backgroundColor: '#125B9A', color: '#ffffff' }}>Add Record</Button>
                    </form>

                    {validation.success != null && (
                        <Typography sx={{ color: validation.success ? "green" : "red", mt: 2 }}>{validation.message}</Typography>
                    )}
                </Box>
            </Container>

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

export default MedicalRecordAdd
