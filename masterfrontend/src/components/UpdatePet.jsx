import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import uploadToCloudinary from '../utils/cloudinaryUtils';
import { Avatar, Button, TextField, Container, Typography, Box, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Header from './Header';

function UpdatePet() {
  const navigate = useNavigate();
  const { pid } = useParams();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [petDetails, setPetDetails] = useState({
    petName: '',
    species: '',
    breed: '',
    weight: '',
    age: '',
    medRec: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/pet/${pid}`);
        const data = response.data;
        console.log('Fetched pet details:', data);
        setPetDetails({
          petName: data.petName || '',
          species: data.species || '',
          breed: data.breed || '',
          weight: data.weight?.toString() || '',
          age: data.age?.toString() || '',
          medRec: data.medRec || '',
          imageUrl: data.imageUrl || '',
          ownerId: data.ownerId
        });
        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
        }
      } catch (error) {
        console.error('Error fetching pet details:', error);
      }
    };
    fetchPetDetails();
  }, [pid]);

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
          return;
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
        pid: parseInt(pid)
      };

      console.log('Image URL before sending:', imageUrl);
      console.log('Full pet data before sending:', petData);

      const response = await axios.put(`http://localhost:8080/api/pet/putPetDetails/${pid}`, petData);

      console.log('Raw backend response:', response);
      console.log('Backend response data:', response.data);

      if (response.data && response.data.pid) {
        console.log('Pet successfully updated with ID:', response.data.pid);
        navigate("/petlist");
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Failed to update pet details - invalid response format');
      }
    } catch (error) {
      console.error("Error updating pet:", error);
      if (error.response) {
        console.error('Response error data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            backgroundColor: '624E88',
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Typography component="h1" variant="h5" sx={{ color: '#125B9A', fontWeight: 600, mb: 3 }}>
            Update Pet Details
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {/* Image Upload Section */}
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={imagePreview || petDetails.imageUrl}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2, backgroundColor: '#125B9A' }}
              >
                Update Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Pet Name"
              name="petName"
              value={petDetails.petName}
              onChange={handleInputChange}
              InputLabelProps={{ style: { color: "#125B9A" } }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Species"
              name="species"
              value={petDetails.species}
              onChange={handleInputChange}
              InputLabelProps={{ style: { color: "#125B9A" } }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Breed"
              name="breed"
              value={petDetails.breed}
              onChange={handleInputChange}
              InputLabelProps={{ style: { color: "#125B9A" } }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Weight"
              name="weight"
              type="number"
              value={petDetails.weight}
              onChange={handleInputChange}
              InputLabelProps={{ style: { color: "#125B9A" } }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={petDetails.age}
              onChange={handleInputChange}
              InputLabelProps={{ style: { color: "#125B9A" } }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Medical Record"
              name="medRec"
              multiline
              rows={4}
              value={petDetails.medRec}
              onChange={handleInputChange}
              InputLabelProps={{ style: { color: "#125B9A" } }}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={uploading}
                sx={{
                  backgroundColor: '#F05A7E',
                  '&:hover': { backgroundColor: '#d63d61' }
                }}
              >
                {uploading ? <CircularProgress size={24} /> : 'Update Pet'}
              </Button>
              <Button
                onClick={() => navigate("/petlist")}
                fullWidth
                variant="outlined"
                sx={{ color: '#125B9A', borderColor: '#125B9A' }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default UpdatePet;
