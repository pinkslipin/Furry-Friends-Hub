import {
    Box,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';
  
  function AppointmentList() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
  
    const handleLogout = () => {
      localStorage.removeItem('user');
      navigate('/login');
    };
  
    useEffect(() => {
      const fetchAppointments = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/appointments/getAppointmentsByOwner/${user.ownerId}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            cache: 'no-store'
          });
  
          if (!response.ok) {
            throw new Error(`Failed to fetch appointments: ${response.statusText}`);
          }
  
          const data = await response.json();
          setAppointments(data);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          setError(error.message);
          setAppointments([]);
        }
      };
  
      fetchAppointments();
    }, [user.ownerId]);
  
    if (error) {
      return (
        <Container maxWidth="lg" style={{ paddingTop: "2em" }}>
          <Typography variant="h6" color="error" align="center">
            {error}
          </Typography>
        </Container>
      );
    }
  
    return (
      <>
        <Header onLogout={handleLogout} user={user} />
        <Container
          maxWidth="lg"
          style={{
            fontFamily: "Poppins, sans-serif",
            paddingTop: "5em",
            paddingBottom: "2em",
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" style={{ color: "#125B9A", fontWeight: 600 }}>
                Appointment List
              </Typography>
            </Box>
  
            <TableContainer component={Paper} style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
              <Table>
                <TableHead style={{ backgroundColor: "#FFBE98" }}>
                  <TableRow>
                    <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Date</TableCell>
                    <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Time</TableCell>
                    <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Status</TableCell>
                    <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Veterinarian</TableCell>
                    <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Pet</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appointment, index) => (
                    <TableRow key={appointment.appointmentId} style={{ backgroundColor: index % 2 === 0 ? "#FFF5EC" : "white" }}>
                      <TableCell>{appointment.appointmentDate}</TableCell>
                      <TableCell>{appointment.appointmentTime}</TableCell>
                      <TableCell>{appointment.status}</TableCell>
                      <TableCell>{appointment.vet ? `${appointment.vet.fname} ${appointment.vet.lname}` : 'N/A'}</TableCell>
                      <TableCell>{appointment.pet ? `${appointment.pet.petName} (ID: ${appointment.pet.pid})` : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </>
    );
  }
  
  export default AppointmentList;