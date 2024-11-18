import { useState,useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios'
import { Box, Button, Container, Grid2 as Grid, IconButton, Select, TextField, Typography } from '@mui/material'
import Header from './Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MedicalRecordAdd({onLogout}) {
    const [pets, setPets] = useState([])
    const [vets, setVets] = useState([])
    //const [medRecs, setMedRecs] = useState([])

    const [validation, setValidation] = useState({message: "", success: null})

    const [formRecord, setFormRecord] = useState({
        medicalProcedure: "",
        medication: "",
        notes: "",
        recordDate: "",
    })

    const petid = useRef(null);
    const vetid = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    const handleLogoutClick = () => {
        onLogout(); 
        navigate('/');
    };

    const handleBackToRecords = () => {
        navigate('/medicalrecords', {state: {user}})
    }

    useEffect(() => {
        fetchPets()
        fetchVets()
    }, [])

    // const fetchMedRecs = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8080/api/medicalrecords/getAllMedicalRecords');
    //         console.log('MedRecs fetched:', response.data); // Debugging line
    //         setMedRecs(response.data);
    //     } catch (error) {
    //         console.error('Error fetching medrecs:', error);
    //     }
    // }

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
  
    const addMedRec = async (e) => {
            e.preventDefault()

        try {
            const response = await axios.post(`http://localhost:8080/api/medicalrecords/postMedicalRecord/?petid=${petid.current}&vetid=${vetid.current}`,formRecord);
            alert(response.data);
            //navigate('/login'); // Redirect to home or desired page after successful signup
            setValidation({message: response.data, success: true})
        } catch (error) {
            console.error('There was an error!', error);
            alert('Adding medical record failed!');
            setValidation({message: "There are errors during adding the form", success: false})
        }
    }

    console.log(formRecord)
    console.log(petid.current)
    console.log(vetid.current)
    console.log(validation)

    return (
        <>
        <Header onLogout={handleLogoutClick} user={user}/>
        <Container maxWidth="md" sx={{mt:8}}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <IconButton onClick={handleBackToRecords} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">Add Medical Records</Typography>
            </Box>

            <Box>
            <form onSubmit={addMedRec}>
                <Grid>
                <Grid><TextField type='text' name="medicalProcedure" label='Medical Procedure' required onChange={handleChange}/></Grid>
                <Grid><TextField type='text' name='medication' label='Medication' required onChange={handleChange}/></Grid>
                <Grid><TextField type='text' name='notes' label='Notes' onChange={handleChange}/></Grid>
                <Grid><input type='date' name='recordDate' label='Record Date' required onChange={handleChange}/></Grid>

                <label>PetID</label>
                <select name='petid' defaultValue="selectID" required onChange={(e) => petid.current = e.target.value}>
                    <option value="selectID" disabled hidden>Select a Pet ID</option>

                    {pets.map((pet,i) => {
                        return <option key={i} value={pet.pid}>{pet.pid}</option>
                    })}
                </select>
                <br/>
                <label>VetID</label>
                <select name='vetid' defaultValue="selectID" required onChange={(e) => vetid.current = e.target.value}>
                    <option value="selectID" disabled hidden>Select a Vet ID</option>

                    {vets.map((vet,i) => {
                        return <option key={i} value={vet.vetid}>{vet.vetid}</option>
                    })}
                </select>   
                <br/>
                <Select>
                    
                </Select>

                <Button type='submit' variant='contained'>Add Record</Button>
                </Grid>
            </form>
            </Box>
        </Container>

        </>
    )
}

export default MedicalRecordAdd
