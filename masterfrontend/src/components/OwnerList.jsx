import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Draggable from 'react-draggable';
import { motion } from 'framer-motion'; // Add framer-motion

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

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const hoverEffect = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 }
};

const PaperComponent = (props) => {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
};

function OwnerList() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [notification, setNotification] = useState("");
  const [ownerImages, setOwnerImages] = useState({});
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: "", message: "", action: null });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwnerImage = async (ownerId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/furryfriendshubowner/profile/image/${ownerId}`,
        { responseType: "arraybuffer" }
      );
      const arrayBufferView = new Uint8Array(response.data);
      const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setOwnerImages((prevImages) => ({ ...prevImages, [ownerId]: imageUrl }));
    } catch (error) {
      console.error(`Error fetching image for owner ${ownerId}:`, error);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/furryfriendshubowner/getAllOwners"
      );
      setOwners(response.data);
      response.data.forEach((owner) => {
        fetchOwnerImage(owner.ownerId);
      });
    } catch (error) {
      console.error("Error fetching owners:", error);
      setNotification("Error fetching owners.");
    }
  };

  const handleEditOpen = (owner) => {
    setSelectedOwner(owner);
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setSelectedOwner(null);
  };

  const handleDeleteOpen = (owner) => {
    setSelectedOwner(owner);
    setOpenDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDialog(false);
    setSelectedOwner(null);
  };

  const handleDelete = async () => {
    try {
        await axios.delete(
            `http://localhost:8080/api/furryfriendshubowner/deleteOwnerDetails/${selectedOwner.ownerId}`
        );
        setSnackbarMessage("Owner deleted successfully!");
        setOpenSnackbar(true);
        setOwners((prevOwners) => prevOwners.filter((owner) => owner.ownerId !== selectedOwner.ownerId));
        handleDeleteClose();
    } catch (error) {
        console.error("Error deleting owner:", error);
        setNotification("Error deleting owner.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedOwner?.fname) newErrors.fname = "First Name is required.";
    if (!selectedOwner?.lname) newErrors.lname = "Last Name is required.";
    if (!selectedOwner?.phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
    if (!selectedOwner?.address) newErrors.address = "Address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/furryfriendshubowner/profile/edit/${selectedOwner.ownerId}`,
        selectedOwner
      );
      setSnackbarMessage("Owner updated successfully!");
      setOpenSnackbar(true);
      setIsEditing(false);
      setSelectedOwner(null);
      setOwners((prevOwners) =>
        prevOwners.map((owner) =>
          owner.ownerId === selectedOwner.ownerId ? response.data : owner
        )
      );
    } catch (error) {
      console.error("Error updating owner:", error);
      setNotification("Error updating owner.");
    }
  };

  const handleChange = (e) => {
    setSelectedOwner({ ...selectedOwner, [e.target.name]: e.target.value });
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
      <Container
        maxWidth="lg"
        style={{
          fontFamily: "Poppins, sans-serif",
          paddingTop: "5em",
          paddingBottom: "2em",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h4" style={{ color: "#125B9A", fontWeight: 600 }}>
            Owner List
          </Typography>
          {notification && (
            <Alert severity="info" onClose={() => setNotification("")}>
              {notification}
            </Alert>
          )}
          <TableContainer
            component={Paper}
            style={{
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <Table>
              <TableHead style={{ backgroundColor: "#FFBE98" }}>
                <TableRow>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>
                    Profile Picture
                  </TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>
                    First Name
                  </TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>
                    Last Name
                  </TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>
                    Email
                  </TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>
                    Phone Number
                  </TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>
                    Address
                  </TableCell>
                  <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {owners.map((owner) => (
                  <TableRow
                    key={owner.ownerId}
                    style={{ backgroundColor: "#FFF5EC" }}
                  >
                    <TableCell>
                      <Avatar
                        src={ownerImages[owner.ownerId] || "/default-avatar.png"}
                        alt={`${owner.fname} ${owner.lname}`}
                        sx={{
                          width: 70,
                          height: 70,
                          border: "2px solid #FFBE98",
                        }}
                      />
                    </TableCell>
                    <TableCell>{owner.fname}</TableCell>
                    <TableCell>{owner.lname}</TableCell>
                    <TableCell>{owner.email}</TableCell>
                    <TableCell>{owner.phoneNumber}</TableCell>
                    <TableCell>{owner.address}</TableCell>
                    <TableCell>
                      <motion.div {...fadeIn} transition={{ delay: 0.2 }} {...hoverEffect}>
                        <IconButton onClick={() => handleEditOpen(owner)}>
                          <EditIcon style={{ color: "#125B9A" }} />
                        </IconButton>
                      </motion.div>
                      <motion.div {...fadeIn} transition={{ delay: 0.2 }} {...hoverEffect}>
                        <IconButton onClick={() => handleDeleteOpen(owner.ownerId)}>
                          <DeleteIcon style={{ color: "#F05A7E" }} />
                        </IconButton>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {isEditing && (
            <Dialog open={isEditing} onClose={handleEditClose} PaperComponent={PaperComponent}>
              <DialogTitle style={modalStyles.dialogTitle} id="draggable-dialog-title">Edit Owner</DialogTitle>
              <DialogContent style={modalStyles.dialogContent}>
                <form onSubmit={handleSave}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="First Name"
                        name="fname"
                        value={selectedOwner?.fname || ""}
                        onChange={handleChange}
                        error={!!errors.fname}
                        helperText={errors.fname}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Last Name"
                        name="lname"
                        value={selectedOwner?.lname || ""}
                        onChange={handleChange}
                        error={!!errors.lname}
                        helperText={errors.lname}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={selectedOwner?.phoneNumber || ""}
                        onChange={handleChange}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Address"
                        name="address"
                        value={selectedOwner?.address || ""}
                        onChange={handleChange}
                        error={!!errors.address}
                        helperText={errors.address}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
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
        <DialogTitle style={modalStyles.dialogTitle2} id="draggable-dialog-title">Delete Owner</DialogTitle>
        <DialogContent style={modalStyles.dialogContent}>
            Are you sure you want to delete this owner?
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
}

export default OwnerList;
