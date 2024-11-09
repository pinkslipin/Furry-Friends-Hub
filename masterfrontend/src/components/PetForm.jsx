import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Select, MenuItem, FormControl, InputLabel, Paper } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PetForm() {
  const navigate = useNavigate();
  const [petDetails, setPetDetails] = useState({
    petName: "",
    species: "",
    breed: "",
    weight: "",
    age: "",
    medRec: "",
    owner: ""
  });

  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/owner/getAllOwners");
        setOwners(response.data);
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setPetDetails({ ...petDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/pet/postPetRecord", petDetails);
      navigate("/success");
    } catch (error) {
      console.error("Error registering pet:", error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        style={{
          padding: "2em",
          backgroundColor: "#FFBE98",
          width: "100%",
          maxWidth: "500px", // Limit form width for a better design
          boxSizing: "border-box",
          borderRadius: "10px", // Softer rounded corners
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
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
              style: { backgroundColor: "#fff", borderRadius: "5px" }
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
              style: { backgroundColor: "#fff", borderRadius: "5px" }
            }}
          />
          <TextField
            label="Medical Conditions"
            name="medRec"
            value={petDetails.medRec}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: "#125B9A" } }}
            InputProps={{
              style: { backgroundColor: "#fff", borderRadius: "5px" }
            }}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel style={{ color: "#125B9A" }}>Owner</InputLabel>
            <Select
              name="owner"
              value={petDetails.owner}
              onChange={handleChange}
              style={{ backgroundColor: "#fff", borderRadius: "5px" }}
            >
              {owners.map((owner) => (
                <MenuItem key={owner.oid} value={owner}>
                  {owner.firstName} {owner.lastName} (ID: {owner.oid})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{
              backgroundColor: "#F05A7E",
              color: "white",
              marginTop: "1em",
              fontWeight: 500,
              fontSize: "1rem",
              padding: "0.8em",
              borderRadius: "5px",
            }}
          >
            Register Pet
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default PetForm;