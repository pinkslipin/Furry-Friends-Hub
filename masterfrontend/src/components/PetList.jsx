import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios";

function PetList() {
  const [pets, setPets] = useState([]);
  const [editingPetId, setEditingPetId] = useState(null);
  const [editedPet, setEditedPet] = useState({});

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/pet/getAllPets");
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchPets();
  }, []);

  const handleEdit = (pet) => {
    setEditingPetId(pet.pid);
    setEditedPet({ ...pet });
  };

  const handleCancelEdit = () => {
    setEditingPetId(null);
    setEditedPet({});
  };

  const handleChange = (e) => {
    setEditedPet({ ...editedPet, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const petDataToUpdate = {
        ...editedPet,
        owner: editedPet.ownerId ? { oid: parseInt(editedPet.ownerId, 10) } : null,
      };
      await axios.put(`http://localhost:8080/api/pet/putPetDetails/${editingPetId}`, petDataToUpdate);
      setPets(pets.map((pet) => (pet.pid === editingPetId ? petDataToUpdate : pet)));
      setEditingPetId(null);
      setEditedPet({});
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  const handleDelete = async (pid) => {
    try {
      await axios.delete(`http://localhost:8080/api/pet/deletePet/${pid}`);
      setPets(pets.filter((pet) => pet.pid !== pid));
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <Container
      maxWidth="lg"
      style={{
        fontFamily: "Poppins, sans-serif",
        paddingTop: "2em",
        paddingBottom: "2em",
      }}
    >
      <Typography variant="h4" gutterBottom style={{ color: "#125B9A", fontWeight: 600, textAlign: "center" }}>
        Pet List
      </Typography>
      <TableContainer component={Paper} style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
        <Table>
          <TableHead style={{ backgroundColor: "#FFBE98" }}>
            <TableRow>
              <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Pet Name</TableCell>
              <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Species</TableCell>
              <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Breed</TableCell>
              <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Age</TableCell>
              <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Weight</TableCell>
              <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Medical Conditions</TableCell>
              <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pets.map((pet, index) => (
              <TableRow key={pet.pid} style={{ backgroundColor: index % 2 === 0 ? "#FFF5EC" : "white" }}>
                {editingPetId === pet.pid ? (
                  <>
                    <TableCell>
                      <TextField name="petName" value={editedPet.petName} onChange={handleChange} fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="species" value={editedPet.species} onChange={handleChange} fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="breed" value={editedPet.breed} onChange={handleChange} fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="age" type="number" value={editedPet.age} onChange={handleChange} fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="weight" type="number" value={editedPet.weight} onChange={handleChange} fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="medRec" value={editedPet.medRec} onChange={handleChange} fullWidth />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={handleUpdate}
                        style={{
                          backgroundColor: "#F05A7E",
                          color: "white",
                          marginRight: "10px",
                          borderRadius: "5px",
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancelEdit}
                        style={{
                          color: "#125B9A",
                          borderColor: "#125B9A",
                          borderRadius: "5px",
                        }}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{pet.petName}</TableCell>
                    <TableCell>{pet.species}</TableCell>
                    <TableCell>{pet.breed}</TableCell>
                    <TableCell>{pet.age}</TableCell>
                    <TableCell>{pet.weight}</TableCell>
                    <TableCell>{pet.medRec}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleEdit(pet)}
                        style={{
                          color: "#125B9A",
                          borderColor: "#125B9A",
                          marginRight: "10px",
                          borderRadius: "5px",
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleDelete(pet.pid)}
                        style={{
                          color: "#F05A7E",
                          borderColor: "#F05A7E",
                          borderRadius: "5px",
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default PetList;
