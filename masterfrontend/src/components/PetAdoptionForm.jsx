import { Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography, Avatar, Box, CircularProgress } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import uploadToCloudinary from '../utils/cloudinaryUtils';
import Header from './Header';

function PetForm() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [petDetails, setPetDetails] = useState({
    petName: "",
    species: "",
    breed: "",
    weight: "",
    age: "",
    medRec: "",
    imageUrl: "",
    owner: ""
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = petDetails.imageUrl;

      if (selectedFile) {
        try {
          console.log('Uploading image to Cloudinary...');
          const uploadedUrl = await uploadToCloudinary(selectedFile);
          console.log('Cloudinary upload successful:', uploadedUrl);
          imageUrl = uploadedUrl;
        } catch (error) {
          console.error('Error uploading image to Cloudinary:', error);
          setUploading(false);
          return;  // Exit early if image upload fails
        }
      }

      const petData = {
        petName: petDetails.petName.trim(),
        species: petDetails.species.trim(),
        breed: petDetails.breed.trim(),
        weight: parseFloat(petDetails.weight) || 0,
        age: parseInt(petDetails.age) || 0,
        medRec: petDetails.medRec?.trim() || 'N/A',
        imageUrl: imageUrl,
        ownerId: null
      };

      console.log('Sending pet data to backend:', JSON.stringify(petData, null, 2));

      // Call the API to save the pet data
      const response = await axios.post("http://localhost:8080/api/pet/postPetAdoption", petData);

      console.log('Backend response:', JSON.stringify(response.data, null, 2));

      // Check if the response contains a pet ID (pid) to confirm successful addition
      if (response.data && response.data.pid) {
        console.log('Pet successfully created with ID:', response.data.pid);
        navigate("/pet-adoption-list");  // Redirect on success
      } else {
        console.error('Invalid response format or missing pet ID');
        throw new Error('Failed to save pet details - invalid response format');
      }
    } catch (error) {
      console.error("Error registering pet:", error);
      if (error.response) {
        console.error('Response error data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      // Displaying an alert or error message to the user could be helpful
      alert("There was an issue saving the pet details. Please try again.");
    } finally {
      setUploading(false);
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
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={imagePreview || petDetails.imageUrl}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
            <TextField
              label="Pet Name"
              name="petName"
              value={petDetails.petName}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              InputLabelProps={{ style: { color: "#125B9A" } }}
              InputProps={{
                style: { backgroundColor: "#fff", borderRadius: "5px" }
              }}
            />
            <div style={{ display: 'flex', gap: '1em', marginTop: '1em' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{
                  backgroundColor: "#F05A7E",
                  color: "white",
                  fontWeight: 500,
                  fontSize: "1rem",
                  padding: "0.8em",
                  borderRadius: "5px",
                }}
                disabled={uploading}
              >
                {uploading ? <CircularProgress size={24} /> : 'Register Pet'}
              </Button>
              <Button
                onClick={() => navigate("/pet-adoption-list")}
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
