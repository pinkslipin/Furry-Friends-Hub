import { Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';

function PetForm() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [petDetails, setPetDetails] = useState({
    petName: "",
    species: "",
    breed: "",
    weight: "",
    age: "",
    medRec: "",
    owner: user?.ownerId || ""
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleChange = (e) => {
    setPetDetails({ ...petDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const petData = {
      petName: petDetails.petName,
      species: petDetails.species,
      breed: petDetails.breed,
      weight: parseFloat(petDetails.weight),
      age: parseInt(petDetails.age),
      medRec: petDetails.medRec,
      ownerId: user.ownerId,
    };
  
    try {
      await axios.post("http://localhost:8080/api/pet/postPetRecord", petData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/petsuccess");
    } catch (error) {
      console.error("Error registering pet:", error);
    }
  };

  return (
    <>
      <Header onLogout={handleLogout} user={user} />
      <Container
        maxWidth="sm"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
          marginTop: "64px"
        }}
      >
        <Paper
          style={{
            padding: "2em",
            backgroundColor: "#FFBE98",
            width: "100%",
            maxWidth: "500px",
            boxSizing: "border-box",
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          elevation={3}
        >
          <Typography variant="h4" align="center" gutterBottom style={{ color: "#125B9A", fontWeight: 600 }}>
            Pet Registration
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Pet Name"
              name="petName"
              value={petDetails.petName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: "#125B9A" } }}
              InputProps={{
                style: { backgroundColor: "#fff", borderRadius: "5px" }
              }}
            />
            <TextField
              label="Species"
              name="species"
              value={petDetails.species}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: "#125B9A" } }}
              InputProps={{
                style: { backgroundColor: "#fff", borderRadius: "5px" }
              }}
            />
            <TextField
              label="Breed"
              name="breed"
              value={petDetails.breed}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: "#125B9A" } }}
              InputProps={{
                style: { backgroundColor: "#fff", borderRadius: "5px" }
              }}
            />
            <TextField
              label="Weight"
              name="weight"
              type="number"
              value={petDetails.weight}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: "#125B9A" } }}
              InputProps={{
                style: { backgroundColor: "#fff", borderRadius: "5px" },
                inputProps: { min: 0, step: 0.1 }
              }}
            />
            <TextField
              label="Age"
              name="age"
              type="number"
              value={petDetails.age}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: "#125B9A" } }}
              InputProps={{
                style: { backgroundColor: "#fff", borderRadius: "5px" },
                inputProps: { min: 0, step: 1 }
              }}
            />
            <TextField
              label="Medical Conditions"
              name="medRec"
              value={petDetails.medRec}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              InputLabelProps={{ style: { color: "#125B9A" } }}
              InputProps={{
                style: { backgroundColor: "#fff", borderRadius: "5px" }
              }}
            />
            <TextField
              label="Owner"
              value={`${user?.fname} ${user?.lname}`}
              fullWidth
              margin="normal"
              disabled
              InputLabelProps={{ style: { color: "#125B9A" } }}
              InputProps={{
                style: { backgroundColor: "#fff", borderRadius: "5px" }
              }}
            />
            <div style={{ display: 'flex', gap: '1em', marginTop: '1em' }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                style={{
                  backgroundColor: "#F05A7E",
                  color: "white",
                  fontWeight: 500,
                  fontSize: "1rem",
                  padding: "0.8em",
                  borderRadius: "5px",
                }}
              >
                Register Pet
              </Button>
              <Button
                onClick={() => navigate("/petlist")}
                variant="outlined"
                fullWidth
                style={{
                  borderColor: "#125B9A",
                  color: "#125B9A",
                  fontWeight: 500,
                  fontSize: "1rem",
                  padding: "0.8em",
                  borderRadius: "5px",
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default PetForm;
