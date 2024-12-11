
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Grid, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from './Header';

function MedicalRecordListOwner({ onLogout }) {
    const [medRecs, setMedRecs] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    useEffect(() => {
        const fetchMedicalRecords = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/medicalrecords/getOwnerMedicalRecords/${user.ownerId}`);
                setMedRecs(response.data);
            } catch (error) {
                console.error('Error fetching medical records:', error);
            }
        };

        fetchMedicalRecords();
    }, [user.ownerId]);

    const handleBackToHome = () => {
        navigate('/ownerhome', { state: { user } });
    };

    return (
        <>
            <Header onLogout={onLogout} user={user} />
            <Container maxWidth="md" sx={{ mt: 8, backgroundColor: '#ffc1a8', padding: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton onClick={handleBackToHome} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ color: '#125B9A', fontWeight: 'bold' }}>Medical Records</Typography>
                </Box>
                {medRecs.length > 0 ? (
                    medRecs.map((record) => (
                        <Box key={record.id} sx={{ backgroundColor: 'white', padding: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', mb: 4 }}>
                            <Typography variant="h5" sx={{ color: '#4e342e', fontWeight: 'bold', mb: 2 }}>Medical Record Details</Typography>
                            <Grid container spacing={2} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Medical Record ID:</strong> {record.id}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Date Recorded:</strong> {record.recordDate}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Medical Procedure:</strong> {record.medicalProcedure}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Medication:</strong> {record.medication}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1"><strong>Notes:</strong> {record.notes}</Typography>
                                </Grid>
                            </Grid>
                            <Box sx={{ borderBottom: '2px solid #4e342e', mb: 4 }}></Box>
                            <Typography variant="h5" sx={{ color: '#4e342e', fontWeight: 'bold', mb: 2 }}>Pet Details</Typography>
                            <Grid container spacing={2} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Pet ID:</strong> {record.pet.pid}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Pet Name:</strong> {record.pet.petName}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Species:</strong> {record.pet.species}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Breed:</strong> {record.pet.breed}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Age:</strong> {record.pet.age}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Weight:</strong> {record.pet.weight}</Typography>
                                </Grid>
                            </Grid>
                            <Box sx={{ borderBottom: '2px solid #4e342e', mb: 4 }}></Box>
                            <Typography variant="h5" sx={{ color: '#4e342e', fontWeight: 'bold', mb: 2 }}>Vet Details</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Vet ID:</strong> {record.vet.vetid}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Full Name:</strong> {record.vet.fname} {record.vet.lname}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Specialization:</strong> {record.vet.specialization}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Phone Number:</strong> {record.vet.phoneNum}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    ))
                ) : (
                    <Typography variant="h6" sx={{ color: '#4e342e', fontWeight: 'bold' }}>No medical records found.</Typography>
                )}
            </Container>
        </>
    );
}

export default MedicalRecordListOwner;