import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const AppointmentRequest = ({ onLogout }) => {
  const [appointmentData, setAppointmentData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    vetId: '',
    petId: '',
    description: '',
    status: 'pending'
  });
  const [vets, setVets] = useState([]);
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchVets();
    fetchPets();
  }, []);

  const fetchVets = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/vet/getAllVets');
      setVets(response.data);
    } catch (error) {
      console.error("Error fetching vets", error);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/pet/getPetsByOwner/${user.ownerId}`);
      setPets(response.data);
    } catch (error) {
      console.error("Error fetching pets", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prevState => ({
      ...prevState,
      [name]: value || ''
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const appointmentToSend = {
      ...appointmentData,
      vetId: parseInt(appointmentData.vetId) || 0,
      petId: parseInt(appointmentData.petId) || 0,
      ownerId: user.ownerId
    };

    try {
      await axios.post('http://localhost:8080/api/appointments/postAppointment', appointmentToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      navigate('/appointmentlist');
    } catch (error) {
      console.error("Error creating appointment!", error);
    }
  };

 const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Header onLogout={onLogout} user={user} />
      <Box sx={{ position: 'relative', mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" style={{ color: "#125B9A", fontWeight: 600 }}>
            Request Appointment
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                name="appointmentDate"
                label="Date"
                variant="outlined"
                margin="normal"
                onChange={handleChange}
                value={appointmentData.appointmentDate || ''}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minDate }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="time"
                name="appointmentTime"
                label="Time"
                variant="outlined"
                margin="normal"
                onChange={handleChange}
                value={appointmentData.appointmentTime || ''}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"
                name="description"
                label="Description"
                variant="outlined"
                margin="normal"
                onChange={handleChange}
                value={appointmentData.description || ''}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" margin="normal" required>
                <InputLabel>Vet</InputLabel>
                <Select
                  name="vetId"
                  value={appointmentData.vetId || ''}
                  onChange={handleChange}
                  label="Vet"
                >
                  <MenuItem value=""><em>Select Vet</em></MenuItem>
                  {vets.map(vet => (
                    <MenuItem key={vet.vetid} value={vet.vetid}>
                      {vet.fname} {vet.lname} - {vet.specialization}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" margin="normal" required>
                <InputLabel>Pet</InputLabel>
                <Select
                  name="petId"
                  value={appointmentData.petId || ''}
                  onChange={handleChange}
                  label="Pet"
                >
                  <MenuItem value=""><em>Select Pet</em></MenuItem>
                  {pets.map(pet => (
                    <MenuItem key={pet.pid} value={pet.pid}>
                      {pet.petName} (ID: {pet.pid})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, backgroundColor: '#125B9A', '&:hover': { backgroundColor: '#0e4a7a' } }}>
            Request Appointment
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AppointmentRequest;