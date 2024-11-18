// VetList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, CircularProgress, Typography } from '@mui/material';
import Header from './Header';  // Import the Header component

const VetList = ({ user, onLogout }) => {
    const [vets, setVets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/api/vet/getAllVets')
            .then((response) => {
                setVets(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching vets:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <div>
            <Header user={user} onLogout={onLogout} /> {/* Add Header here */}
            <Typography variant="h4">All Veterinarians</Typography>
            {vets.length === 0 ? (
                <Typography>No Veterinarian available.</Typography> // Display this message if no vets are found
            ) : (
                <List>
                    {vets.map((vet) => (
                        <ListItem key={vet.id}>
                            <ListItemText primary={`${vet.fname} ${vet.lname}`} secondary={vet.specialization} />
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
};

export default VetList;
