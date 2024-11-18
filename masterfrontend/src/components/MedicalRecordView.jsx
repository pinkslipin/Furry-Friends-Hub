import { useState,useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios'
import { Box, Button, Container, Grid2 as Grid, IconButton, TextField, Typography } from '@mui/material'
import Header from './Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MedicalRecordView({onLogout}) {
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
    const location = useLocation();

    const user = location.state?.user;
    const mridView = location.state?.mrid
    const [medRecDetails,setMedRecDetails] = useState(null)

    const handleBackToHome = () => {
        navigate('/')
    }

    const handleLogoutClick = () => {
        onLogout(); 
        navigate('/');
    };

    useEffect(() => {
        fetchMedRecs()
        fetchPets()
        fetchVets()
    }, [])

    const fetchMedRecDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/medicalrecords/getMedicalRecord/${mridView}`);
            console.log('MedRecs fetched:', response.data); // Debugging line
            setMedRecDetails(response.data);
        } catch (error) {
            console.error('Error fetching medrecs:', error);
        }
    }

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
        <Header onLogout={handleLogoutClick} user={user}/>

        
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <IconButton onClick={handleBackToHome} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">View Details of Pet </Typography>
            </Box>

            
        </Container>

        <br/>

        <Container>
            
        </Container>
        
        </>
    )
}

export default MedicalRecordView
