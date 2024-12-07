import {
  Alert,
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
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function OwnerList() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [notification, setNotification] = useState("");
  const [ownerImages, setOwnerImages] = useState({});
  const [errors, setErrors] = useState({});
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

  const handleEdit = (owner) => {
    setSelectedOwner(owner);
    setIsEditing(true);
  };

  const handleDelete = async (ownerId) => {
    if (!window.confirm("Are you sure you want to delete this owner?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/furryfriendshubowner/deleteOwnerDetails/${ownerId}`
      );
      setNotification("Owner deleted successfully!");
      fetchOwners();
    } catch (error) {
      console.error("Error deleting owner:", error);
      setNotification("Error deleting owner.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedOwner?.fname) newErrors.fname = "First Name is required.";
    if (!selectedOwner?.lname) newErrors.lname = "Last Name is required.";
    if (!selectedOwner?.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required.";
    if (!selectedOwner?.address) newErrors.address = "Address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(
        `http://localhost:8080/api/furryfriendshubowner/profile/edit/${selectedOwner.ownerId}`,
        selectedOwner
      );
      setNotification("Owner updated successfully!");
      setIsEditing(false);
      setSelectedOwner(null);
      fetchOwners();
    } catch (error) {
      console.error("Error updating owner:", error);
      setNotification("Error updating owner.");
    }
  };

  const handleChange = (e) => {
    setSelectedOwner({ ...selectedOwner, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedOwner(null);
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
                            border: '2px solid #FFBE98'
                          }}
                      />
                    </TableCell>
                    <TableCell>{owner.fname}</TableCell>
                    <TableCell>{owner.lname}</TableCell>
                    <TableCell>{owner.email}</TableCell>
                    <TableCell>{owner.phoneNumber}</TableCell>
                    <TableCell>{owner.address}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleEdit(owner)}
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
                        onClick={() => handleDelete(owner.ownerId)}
                        style={{
                          color: "#F05A7E",
                          borderColor: "#F05A7E",
                          borderRadius: "5px",
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
              <Typography variant="h6" style={{ marginBottom: "1em" }}>
                Edit Owner
              </Typography>
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
              <Button
                variant="contained"
                onClick={handleSave}
                style={{
                  backgroundColor: "#125B9A",
                  color: "white",
                  marginRight: "10px",
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                style={{ color: "#F05A7E", borderColor: "#F05A7E" }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}

export default OwnerList;
