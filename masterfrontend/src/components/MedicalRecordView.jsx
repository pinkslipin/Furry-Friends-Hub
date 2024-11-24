import { useState,useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios'
import { Box, Button, Container, Grid2 as Grid, IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader, TextField, Typography } from '@mui/material'
import Header from './Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MedicalRecordView({onLogout}) {
    const [pets, setPets] = useState([])
    const [vets, setVets] = useState([])
    const [medRecs, setMedRecs] = useState([])

    const [validation, setValidation] = useState(null)

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
    

    const [isPetView,setPetView] = useState(false)

    const handleLogoutClick = () => {
        onLogout(); 
        navigate('/login');
    };

    const handleBackToRecords = () => {
        navigate('/medicalrecords', {state: {user}})
    }

    // useEffect(() => {
    //     const fetchMedRecDetails = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:8080/api/medicalrecords/getMedicalRecord/${medRecView.id}`);
    //             console.log('MedRecs fetched:', response.data); // Debugging line
    //             setMedRecDetails(response.data);
    //         } catch (error) {
    //             console.error('Error fetching medrecs:', error);
    //         }
    //     }

    //     fetchMedRecDetails()
    // }, [])

    

    const fetchPets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/pet/getAllPets');
            console.log('Pets fetched:', response.data); // Debugging line
            setPets(response.data);
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    }

    const fetchVets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vet/getAllVets');
            
            console.log('Vets fetched:', response.data); // Debugging line
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
            setValidation(response.data)
            //navigate('/login'); // Redirect to home or desired page after successful signup
        } catch (error) {
            console.error('There was an error!', error);
            setValidation("There is an error inside the database");
        }
    }

    const handleDeleteRecord = () => {
        if(window.confirm(`Are you sure to delete Medical Record ID ${medRecView.id}?`)){
            deleteRecord()
            handleBackToRecords()
        }
    }
  
    const addMedRec = async (e) => {
            e.preventDefault()

        try {
            const response = await axios.post(`http://localhost:8080/api/medicalrecords/postMedicalRecord/?petid=${petid.current}&vetid=${vetid.current}`,formRecord);
            alert("Medical Report added");
            //navigate('/login'); // Redirect to home or desired page after successful signup
        } catch (error) {
            console.error('There was an error!', error);
            alert('Signup failed!');
        }
    }

    // console.log(formRecord)
    console.log(medRecView.id)

    const gridColor = {
        backgroundColor: "white",
    }

    const gridCell = {
        backgroundColor: "lightgray",
    }

    return (
        <>
        <Header onLogout={handleLogoutClick} user={user}/>

        
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <IconButton onClick={handleBackToRecords} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">Medical Record of Pet {medRecView.pet.petName}</Typography>
            </Box>

            <h3>Medical Record Details</h3>
            <Grid container rowSpacing={2} sx={{...gridColor,border:"1px black solid", borderRadius: 2, marginBottom:5}}>
                <Grid size={4}>
                    <p>{`Medical Record ID: ${medRecView.id}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Date Recorded: ${medRecView.recordDate}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Medical Procedure: ${medRecView.medicalProcedure}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Medication: ${medRecView.medication}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Notes: ${medRecView.medicalProcedure}`}</p>
                </Grid>
            </Grid>

            <h3>Pet Details</h3>
            <Grid container rowSpacing={2} sx={{...gridColor,border:"1px black solid", borderRadius:3, marginBottom:5}}>
                <Grid size={4}>
                    <p>{`Pet ID: ${medRecView.pet.pid}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Pet Name: ${medRecView.pet.petName}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Species: ${medRecView.pet.species}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Breed: ${medRecView.pet.breed}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Age: ${medRecView.pet.age}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Weight: ${medRecView.pet.weight}`}</p>
                </Grid>
            </Grid>

            <h3>Vet Details</h3>
            <Grid container rowSpacing={2} sx={{...gridColor,border:"1px black solid", borderRadius: 2}}>
                <Grid size={4}>
                    <p>{`Vet ID: ${medRecView.vet.vetid}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Full Name: ${medRecView.vet.fname} ${medRecView.vet.lname}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Specialization: ${medRecView.vet.specialization}`}</p>
                </Grid>
                <Grid size={4}>
                    <p>{`Phone Number: ${medRecView.vet.phoneNum}`}</p>
                </Grid>
            </Grid>

            {user.role === "VET" &&
                <>
                    <Button variant="contained" sx={{backgroundColor:"red"}} onClick={handleDeleteRecord}>Delete Medical Record</Button>
                    {/* <Button variant="contained" sx={{backgroundColor:"green"}}>Modify Medical Record</Button> */}

                    {validation != null && 
                        <p>{validation}</p>
                    }
                </>
            }

            

        </Container>
        
        </>
    )
}

export default MedicalRecordView
