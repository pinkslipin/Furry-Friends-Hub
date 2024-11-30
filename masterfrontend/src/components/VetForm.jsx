import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Avatar,
  TextField,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const VetForm = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [vets, setVets] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);
  const [notification, setNotification] = useState("");
  const [vetImages, setVetImages] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVetImage = async (vetId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/vet/profile/image/${vetId}`,
        { responseType: "arraybuffer" }
      );
      const arrayBufferView = new Uint8Array(response.data);
      const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setVetImages((prevImages) => ({ ...prevImages, [vetId]: imageUrl }));
    } catch (error) {
      console.error(`Error fetching image for vet ${vetId}:`, error);
    }
  };

  const fetchVets = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/vet/getAllVets");
      setVets(response.data);
      response.data.forEach((vet) => fetchVetImage(vet.vetid));
    } catch (error) {
      console.error("Error fetching vets:", error);
      setNotification("Error fetching veterinarians.");
    }
  };

  const handleEdit = (vet) => {
    setSelectedVet(vet);
    setIsEditing(true);
  };

  const handleDelete = async (vetId) => {
    if (!window.confirm("Are you sure you want to delete this vet?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/vet/deleteVet/${vetId}`);
      setNotification("Veterinarian deleted successfully!");
      fetchVets();
    } catch (error) {
      console.error("Error deleting vet:", error);
      setNotification("Error deleting veterinarian.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedVet?.fname) newErrors.fname = "First Name is required.";
    if (!selectedVet?.lname) newErrors.lname = "Last Name is required.";
    if (!selectedVet?.specialization) newErrors.specialization = "Specialization is required.";
    if (!selectedVet?.phoneNum) newErrors.phoneNum = "Phone Number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(
        `http://localhost:8080/api/vet/putVetDetails?vetid=${selectedVet.vetid}`,
        selectedVet
      );
      setNotification("Veterinarian updated successfully!");
      setIsEditing(false);
      setSelectedVet(null);
      fetchVets();
    } catch (error) {
      console.error("Error updating vet:", error);
      setNotification("Error updating veterinarian.");
    }
  };

  const handleChange = (e) => {
    setSelectedVet({ ...selectedVet, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedVet(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <Header onLogout={handleLogout} user={user} />
      <Container maxWidth="lg" sx={{ pt: 5, pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h4" sx={{ color: "#125B9A", fontWeight: 600 }}>
            Veterinarian List
          </Typography>
          {notification && (
            <Alert severity="info" onClose={() => setNotification("")}>
              {notification}
            </Alert>
          )}
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#FFBE98" }}>
                <TableRow>
                  <TableCell sx={{ color: "#125B9A", fontWeight: 600 }}>
                    Profile Picture
                  </TableCell>
                  <TableCell sx={{ color: "#125B9A", fontWeight: 600 }}>
                    First Name
                  </TableCell>
                  <TableCell sx={{ color: "#125B9A", fontWeight: 600 }}>
                    Last Name
                  </TableCell>
                  <TableCell sx={{ color: "#125B9A", fontWeight: 600 }}>
                    Specialization
                  </TableCell>
                  <TableCell sx={{ color: "#125B9A", fontWeight: 600 }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: "#125B9A", fontWeight: 600 }}>
                    Phone Number
                  </TableCell>
                  <TableCell sx={{ color: "#125B9A", fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vets.map((vet) => (
                  <TableRow key={vet.vetid}>
                    <TableCell>
                      <Avatar
                        src={vetImages[vet.vetid]}
                        alt={`${vet.fname} ${vet.lname}`}
                        sx={{
                          width: 70,
                          height: 70,
                          border: "2px solid #FFBE98",
                        }}
                      />
                    </TableCell>
                    <TableCell>{vet.fname}</TableCell>
                    <TableCell>{vet.lname}</TableCell>
                    <TableCell>{vet.specialization}</TableCell>
                    <TableCell>{vet.email}</TableCell>
                    <TableCell>{vet.phoneNum}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleEdit(vet)}
                        sx={{
                          color: "#125B9A",
                          borderColor: "#125B9A",
                          mr: 1,
                          borderRadius: 1,
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleDelete(vet.vetid)}
                        sx={{
                          color: "#F05A7E",
                          borderColor: "#F05A7E",
                          borderRadius: 1,
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {isEditing && (
            <Box mt={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Edit Veterinarian
              </Typography>
              <TextField
                label="First Name"
                name="fname"
                value={selectedVet?.fname || ""}
                onChange={handleChange}
                error={!!errors.fname}
                helperText={errors.fname}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="lname"
                value={selectedVet?.lname || ""}
                onChange={handleChange}
                error={!!errors.lname}
                helperText={errors.lname}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Specialization"
                name="specialization"
                value={selectedVet?.specialization || ""}
                onChange={handleChange}
                error={!!errors.specialization}
                helperText={errors.specialization}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number"
                name="phoneNum"
                value={selectedVet?.phoneNum || ""}
                onChange={handleChange}
                error={!!errors.phoneNum}
                helperText={errors.phoneNum}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{ mt: 2, mr: 2 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default VetForm;
