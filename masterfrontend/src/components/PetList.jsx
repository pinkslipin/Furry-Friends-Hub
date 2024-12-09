import {
  Avatar,
  Box,
  Button,
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
import axios from "axios";

function PetList() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchImage = async (pid) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/pet/image/${pid}`, { responseType: 'arraybuffer' });
        const blob = new Blob([new Uint8Array(response.data)], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error(`Error fetching image for pet ${pid}:`, error);
        return null;
      }
    };
  
    const loadImages = async () => {
      const updatedPets = await Promise.all(
        pets.map(async (pet) => {
          if (!pet.imageUrl) {
            // Fetch image only if imageUrl is not already set
            const fetchedImageUrl = await fetchImage(pet.pid);
            return { ...pet, imageUrl: fetchedImageUrl };
          }
          return pet; // If imageUrl exists, keep it as is
        })
      );
      setPets(updatedPets);
    };
  
    if (pets.length > 0) {
      loadImages();
    }
  }, [pets]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const isVet = user?.role === 'VET';
        const endpoint = isVet 
          ? "http://localhost:8080/api/pet/getAllPets"
          : `http://localhost:8080/api/pet/owner/${user.ownerId}`;

        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch pets: ${response.statusText}`);
        }

        const rawText = await response.text();
        
        try {
          const data = JSON.parse(rawText);
          console.log('Current user:', user);
          console.log('User role:', user?.role);
          console.log('Full pet data:', data);
          if (data && data.length > 0) {
            console.log('First pet owner details:', data[0].owner);
          }
          setPets(Array.isArray(data) ? data : []);
        } catch (jsonError) {
          console.error('Raw response:', rawText);
          console.error('JSON parse error:', jsonError);
          throw new Error('Invalid JSON response from server');
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
        setError(error.message);
        setPets([]); 
      }
    };

    if (user) {
      fetchPets();
    } else {
      setError("Please log in to view pets");
    }
  }, [lastUpdate]);

  const handleDelete = async (pid) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pet/deletePet/${pid}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete pet: ${response.statusText}`);
      }

      setPets(pets.filter((pet) => pet.pid !== pid));
      setLastUpdate(Date.now());
    } catch (error) {
      console.error("Error deleting pet:", error);
      setError(error.message);
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: "2em" }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  const isVet = user?.role === 'VET';

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
              Pet List
            </Typography>
            {!isVet && (
              <Button
                variant="contained"
                onClick={() => navigate('/petform')}
                sx={{
                  backgroundColor: '#F05A7E',
                  '&:hover': { backgroundColor: '#d64d6f' },
                  borderRadius: '5px',
                  color: 'white',
                  padding: '8px 16px'
                }}
              >
                Add New Pet
              </Button>
            )}
          </Box>

          <TableContainer component={Paper} style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
            <Table>
              <TableHead style={{ backgroundColor: "#FFBE98" }}>
                <TableRow>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Pet Image</TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Pet Name</TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Species</TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Breed</TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Age</TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Weight</TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Medical Conditions</TableCell>
                  {isVet && <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Owner</TableCell>}
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(pets) && pets.length > 0 ? (
                  pets.map((pet, index) => (
                    <TableRow key={pet.pid} style={{ backgroundColor: index % 2 === 0 ? "#FFF5EC" : "white" }}>
                      <TableCell>
                        <Avatar
                          src={pet.image ? `data:image/jpeg;base64,${pet.image}` : pet.imageUrl}
                          alt={pet.petName}
                          sx={{
                            width: 60,
                            height: 60,
                            border: '2px solid #FFBE98'
                          }}
                        />
                      </TableCell>
                      <TableCell>{pet.petName}</TableCell>
                      <TableCell>{pet.species}</TableCell>
                      <TableCell>{pet.breed}</TableCell>
                      <TableCell>{pet.age}</TableCell>
                      <TableCell>{pet.weight}</TableCell>
                      <TableCell>{pet.medRec}</TableCell>
                      {isVet && (
                        <TableCell>
                          {pet.owner ? `${pet.owner.fname} ${pet.owner.lname}` : 'N/A'}
                        </TableCell>
                      )}
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => navigate(`/update-pet/${pet.pid}`)}
                          style={{
                            color: "#125B9A",
                            borderColor: "#125B9A",
                            marginRight: "10px",
                            borderRadius: "5px",
                          }}
                        >
                          Edit
                        </Button>
                        {!isVet && (
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
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isVet ? 9 : 8} align="center">
                      <Typography variant="body1">No pets found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
}

export default PetList;