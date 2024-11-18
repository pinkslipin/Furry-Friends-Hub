import { useState,useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios'
import { Box, Button, Container, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import Header from './Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MedicalRecordList({onLogout}) {
    const [medRecs, setMedRecs] = useState([])
    
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    const handleBackToHome = () => {
        navigate('/')
    }

    const handleGoToAddRecord = () => {
        navigate("/medicalrecords/add", {state : {user}})
    }

    const handleLogoutClick = () => {
        onLogout(); 
        navigate('/');
    };

    useEffect(() => {
        const fetchVetMedRecs = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/medicalrecords/getVetMedicalRecords/${user.vetid}`);
            console.log('MedRecs fetched:', response.data); // Debugging line
            setMedRecs(response.data);
        } catch (error) {
            console.error('Error fetching medrecs:', error);
        }
    }
        fetchVetMedRecs()
    }, [])

    

    console.log(user)

    return (
        <>
        <Header onLogout={handleLogoutClick} user={user}/>
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <IconButton onClick={handleBackToHome} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">Medical Records</Typography>
            </Box>

            <Button variant='contained' onClick={handleGoToAddRecord}>Add Medical Record</Button>

            <List style={{border: "2px white solid", borderRadius:15}} sx={{height: 600, overflow:"auto"}}>
                {medRecs.length > 0 
                    ? 
                    medRecs.map((medRec,i) => {
                        return <ListItem key={i} style={{border: "1px white solid"}} alignItems='flex-start'>
                                    <ListItemText primary={`Medical Record ID: ${medRec.id}`} secondary={`Date Recorded: ${medRec.recordDate}`} />
                                    <ListItemText primary={`Pet: ${medRec.pet.petName}`} secondary={`Pet ID: ${medRec.pet.pid}`}/>
                                    <ListItemText primary={`Vet: ${medRec.vet.fname}`} secondary={`Vet ID: ${medRec.vet.vetid}`}/>
                                    
                                    <Button variant='contained'>View Details</Button>
                                </ListItem>
                    })
                    
                    :
                    <ListItem>No medical records found</ListItem>
                }
            </List>
        </Container>
        </>
    )
}

export default MedicalRecordList
