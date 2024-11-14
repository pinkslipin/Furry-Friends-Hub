// AppointmentList.jsx
import { CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from './Header'; // Import the Header component

const AppointmentList = ({ user, onLogout }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/api/appointments/getAllAppointments')  // Adjust this API endpoint accordingly
            .then((response) => {
                setAppointments(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching appointments:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <div>
            <Header user={user} onLogout={onLogout} /> {/* Add Header here */}
            <Typography variant="h4">Your Appointments</Typography>
            <List>
                {appointments.map((appointment) => (
                    <ListItem key={appointment.id}>
                        <ListItemText
                            primary={`Appointment with ${appointment.vet.firstName} ${appointment.vet.lastName}`}
                            secondary={`Date: ${appointment.date}`}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default AppointmentList;
