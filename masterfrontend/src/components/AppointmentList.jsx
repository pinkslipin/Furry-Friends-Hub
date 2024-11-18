// AppointmentList.jsx
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from './Header';

const AppointmentList = ({ user, onLogout }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // Track errors

    useEffect(() => {
        axios.get('http://localhost:8080/api/appointments/getAllAppointments')
            .then((response) => {
                setAppointments(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching appointments:', error);
                setError('Failed to load appointments.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Header user={user} onLogout={onLogout} />
            <Typography variant="h4" gutterBottom>Your Appointments</Typography>
            {error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <List>
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <ListItem key={appointment.appointmentId}>
                                <ListItemText
                                    primary={`Appointment with ${appointment.vet.fname} ${appointment.vet.lname}`}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="textPrimary">
                                                Date: {appointment.appointmentDate} {appointment.appointmentTime}
                                            </Typography>
                                            <br />
                                            Status: {appointment.status}
                                            <br />
                                            Pet: {appointment.pet ? `${appointment.pet.petName} (ID: ${appointment.pet.pid})` : 'N/A'}
                                            <br />
                                            Amount Due: {appointment.billing ? appointment.billing.amountDue : 'N/A'}
                                            <br />
                                            Amount Paid: {appointment.billing ? appointment.billing.amountPaid : 'N/A'}
                                        </>
                                    }
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography>No appointments available.</Typography>
                    )}
                </List>
            )}
        </div>
    );
};

export default AppointmentList;