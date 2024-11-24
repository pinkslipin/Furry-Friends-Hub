import { useState,useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios'
import { Box, Button, Container, IconButton, List, ListItem, ListItemButton, ListItemText, Typography, Grid2 as Grid } from '@mui/material'
import Header from './Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MedicalRecordList({onLogout}) {
    const [medRecs, setMedRecs] = useState([])
    
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    const handleBackToHome = () => {
        navigate('/vethome', {state: {user}})
    }

    const handleGoToAddRecord = () => {
        navigate("/medicalrecords/add", {state : {user}})
    }

    const handleLogoutClick = () => {
        onLogout(); 
        navigate('/login');
    };

    useEffect(() => {
        const fetchVetMedRecs = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/medicalrecords/getAllMedicalRecords`);
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

            <Grid sx={{mb: 2}}>
                <Button variant='contained' onClick={handleGoToAddRecord}>Add Medical Record</Button>
            </Grid>

            <List style={{backgroundColor: "white", borderRadius:5}} sx={{height: 600, overflow:"auto"}}>
                {medRecs.length > 0 
                    ? 
                    medRecs.map((medRec,i) => {
                        return <ListItem key={i} sx={{border: "1px white solid"}} alignItems='flex-start'>
                                    <ListItemText primary={`Medical Record ID: ${medRec.id}`} secondary={`Date Recorded: ${medRec.recordDate}`} />
                                    <ListItemText primary={`Pet: ${medRec.pet.petName}`} secondary={`Pet ID: ${medRec.pet.pid}`}/>
                                    <ListItemText primary={`Vet: ${medRec.vet.fname}`} secondary={`Vet ID: ${medRec.vet.vetid}`}/>
                                    
                                    <Button variant='contained' onClick={() => navigate('/medicalrecords/view', {state: {user: user, medRec: medRec}} )}>View Details</Button>
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
