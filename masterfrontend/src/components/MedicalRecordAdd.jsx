import { useState,useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios'
import { Box, Button, Container, FormControl, Grid2 as Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import Header from './Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MedicalRecordAdd({onLogout}) {
    const [pets, setPets] = useState([])
    const [vets, setVets] = useState([])
    //const [medRecs, setMedRecs] = useState([])

    const [validation, setValidation] = useState({message: "", success: null})

    const dateToday = new Date().toISOString().substring(0, 10)

    const [formRecord, setFormRecord] = useState({
        medicalProcedure: "",
        medication: "",
        notes: "",
        recordDate: dateToday,
    })

    const [petid,setPetId] = useState('');
    const [vetid,setVetId] = useState('');

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
            const response = await axios.post(`http://localhost:8080/api/medicalrecords/postMedicalRecord/?petid=${petid}&vetid=${vetid}`,formRecord);
            //navigate('/login'); // Redirect to home or desired page after successful signup

            setValidation({message: response.data, success: true})
        } catch (error) {
            console.error('There was an error!', error);
            alert('Adding medical record failed!');
            setValidation({message: "Errors occurred during adding the form", success: false})
        }
    }

    // console.log(formRecord)
    // console.log(petid)
    // console.log(vetid)
    // console.log(validation)

    return (
        <>
        <Header onLogout={handleLogoutClick} user={user}/>
        <Container maxWidth="md" sx={{mt:8}}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <IconButton onClick={handleBackToRecords} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">Add Medical Record</Typography>
            </Box>

            <Box>
            <form onSubmit={addMedRec}>
                
                <TextField type='text' name="medicalProcedure" label='Medical Procedure' required onChange={handleChange}/>
                <br/>
                <TextField type='text' name='medication' label='Medication' required onChange={handleChange}/>
                <br/>
                <TextField type='text' name='notes' label='Notes' onChange={handleChange}/>
                <br/>
                <input type='date' name='recordDate' label='Record Date' defaultValue={dateToday} min={dateToday} required onChange={handleChange} style={{width:200}}/>
                <br/>
                <FormControl style={{width: 200}} variant='filled'>
                    <InputLabel id='petid'>Pet ID</InputLabel>
                    <Select labelId='petid' value={petid} label="Pet ID" required onChange={(e) => setPetId(e.target.value)}>
                    {pets.map((pet,i) => {
                        return <MenuItem key={i} value={pet.pid}>{pet.pid}</MenuItem>
                    })}
                    </Select>
                </FormControl>

                <br/>

                <FormControl style={{width: 200}} variant='filled'>
                    <InputLabel id='vetid'>Vet ID</InputLabel>
                    <Select labelId='vetid' value={vetid} label="Vet ID" required onChange={(e) => setVetId(e.target.value)}>
                    {vets.map((vet,i) => {
                        return <MenuItem key={i} value={vet.vetid}>{vet.vetid}</MenuItem>
                    })}
                    </Select>
                </FormControl>

                <br/>

                <Button type='submit' variant='contained'>Add Record</Button>
            </form>

            {validation.success != null &&
                <p><span style={{color: validation.success ? "green" : "red" }}>{validation.message}</span></p>
            }
            </Box>
        </Container>

        </>
    )
}

export default MedicalRecordAdd
