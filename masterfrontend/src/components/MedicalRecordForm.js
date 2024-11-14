import { useState,useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import axios from 'axios'
import { Box, Button, Container, Grid2 as Grid, List, ListItem, ListItemText, TextField, Typography } from '@mui/material'

function MedicalRecordForm() {
    const [pets, setPets] = useState([])
    const [vets, setVets] = useState([])
    const [medRecs, setMedRecs] = useState([])

    const [validation, setValidation] = useState('')

    const [formRecord, setFormRecord] = useState({
        medicalProcedure: "",
        medication: "",
        notes: "",
        recordDate: "",
    })

    const petid = useRef("");
    const vetid = useRef("");
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/')
    }

    useEffect(() => {
        fetchMedRecs()
        fetchPets()
        fetchVets()
    }, [])

    const fetchMedRecs = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/medicalrecords/getAllMedicalRecords');
            console.log('MedRecs fetched:', response.data); // Debugging line
            setMedRecs(response.data);
        } catch (error) {
            console.error('Error fetching medrecs:', error);
        }
    }

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
            alert("Medical Report added");
            //navigate('/login'); // Redirect to home or desired page after successful signup
        } catch (error) {
            console.error('There was an error!', error);
            alert('Signup failed!');
        }
    }

    console.log(formRecord)
    console.log(petid.current)
    console.log(vetid.current)

    return (
        <>
        <Container>
            <Box>
            <Typography>Add Medical Record</Typography>
            <form onSubmit={addMedRec}>
                <Grid>
                <Grid><TextField type='text' name="medicalProcedure" label='Medical Procedure' onChange={handleChange}/></Grid>
                <Grid><TextField type='text' name='medication' label='Medication' onChange={handleChange}/></Grid>
                <Grid><TextField type='text' name='notes' label='Notes' onChange={handleChange}/></Grid>
                <Grid><input type='date' name='recordDate' label='Record Date' onChange={handleChange}/></Grid>

                <label>PetID</label>
                <select name='petid' onChange={(e) => petid.current = e.target.value}>
                    {pets.map((pet,i) => {
                        return <option key={i} value={pet.pid}>{pet.pid}</option>
                    })}
                </select>
                <br/>
                <label>VetID</label>
                <select name='vetid' onChange={(e) => vetid.current = e.target.value}>
                    {vets.map((vet,i) => {
                        return <option key={i} value={vet.vetid}>{vet.vetid}</option>
                    })}
                </select>   
                <br/>
                    
                <Button type='submit' variant='contained'>Add Record</Button>
                </Grid>
            </form>
            </Box>
        </Container>

        <br/>

        <Container>
            
        </Container>

        <Button variant="contained" onClick={handleBackToHome} className="back-button">Back to Home</Button>
        </>
    )
}

export default MedicalRecordForm
