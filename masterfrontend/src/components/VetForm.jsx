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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Draggable from 'react-draggable';

const modalStyles = {
  dialogTitle: {
    backgroundColor: '#125B9A',
    color: 'white',
    cursor: 'move'
  },
  dialogTitle2: {
    backgroundColor: '#F05A7E',
    color: 'white',
    cursor: 'move'
  },
  dialogContent: {
    padding: '20px'
  },
  dialogActions: {
    padding: '10px 20px'
  },
  button: {
    backgroundColor: '#F05A7E',
    color: 'white',
    '&:hover': {
      backgroundColor: '#d64d6f'
    }
  },
  button2: {
    backgroundColor: '#125B9A',
    color: 'white',
    '&:hover': {
      backgroundColor: '#125B9A'
    }
  }
};

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
};

const VetForm = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [vets, setVets] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);
  const [notification, setNotification] = useState("");
  const [vetImages, setVetImages] = useState({});
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: "", message: "", action: null });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  const handleEditOpen = (vet) => {
    setSelectedVet(vet);
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setSelectedVet(null);
  };

  const handleDeleteOpen = (vet) => {
    setSelectedVet(vet);
    setOpenDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDialog(false);
    setSelectedVet(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/vet/deleteVet/${selectedVet.vetid}`);
      setSnackbarMessage("Veterinarian deleted successfully!");
      setOpenSnackbar(true);
      setVets((prevVets) => prevVets.filter((vet) => vet.vetid !== selectedVet.vetid));
      handleDeleteClose();
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

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/vet/putVetDetails?vetid=${selectedVet.vetid}`,
        selectedVet
      );
      setSnackbarMessage("Veterinarian updated successfully!");
      setOpenSnackbar(true);
      setIsEditing(false);
      setSelectedVet(null);
      setVets((prevVets) =>
        prevVets.map((vet) =>
          vet.vetid === selectedVet.vetid ? response.data : vet
        )
      );
    } catch (error) {
      console.error("Error updating vet:", error);
      setNotification("Error updating veterinarian.");
    }
  };

  const handleChange = (e) => {
    setSelectedVet({ ...selectedVet, [e.target.name]: e.target.value });
  };

  const handleDialogOpen = (title, message, action) => {
    setDialogContent({ title, message, action });
    setOpenDialog(true);
  };

  const handleDialogClose = (confirmed) => {
    setOpenDialog(false);
    if (confirmed && dialogContent.action) {
      dialogContent.action();
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
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
                      <IconButton onClick={() => handleEditOpen(vet)}>
                        <EditIcon style={{ color: "#125B9A" }} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteOpen(vet)}>
                        <DeleteIcon style={{ color: "#F05A7E" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {isEditing && (
            <Dialog open={isEditing} onClose={handleEditClose} PaperComponent={PaperComponent}>
              <DialogTitle style={modalStyles.dialogTitle} id="draggable-dialog-title">Edit Veterinarian</DialogTitle>
              <DialogContent style={modalStyles.dialogContent}>
                <form onSubmit={handleSave}>
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
                  <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.specialization}>
                    <InputLabel>Specialization</InputLabel>
                    <Select
                      name="specialization"
                      value={selectedVet?.specialization || ""}
                      onChange={handleChange}
                      label="Specialization"
                    >
                      <MenuItem value="Small Animal Practice">Small Animal Practice</MenuItem>
                      <MenuItem value="Large Animal Practice">Large Animal Practice</MenuItem>
                      <MenuItem value="Mixed Animal Practice">Mixed Animal Practice</MenuItem>
                    </Select>
                    {errors.specialization && <Typography color="error">{errors.specialization}</Typography>}
                  </FormControl>
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
                  <DialogActions style={modalStyles.dialogActions}>
                    <Button onClick={handleEditClose} style={modalStyles.button2}>
                      Cancel
                    </Button>
                    <Button type="submit" style={modalStyles.button2} autoFocus>
                      Save
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </Box>
      </Container>
      <Dialog open={openDialog} onClose={handleDeleteClose} PaperComponent={PaperComponent}>
        <DialogTitle style={modalStyles.dialogTitle2} id="draggable-dialog-title">Delete Veterinarian</DialogTitle>
        <DialogContent style={modalStyles.dialogContent}>
          Are you sure you want to delete this veterinarian?
        </DialogContent>
        <DialogActions style={modalStyles.dialogActions}>
          <Button onClick={handleDeleteClose} style={modalStyles.button}>
            Cancel
          </Button>
          <Button onClick={handleDelete} style={modalStyles.button} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default VetForm;
