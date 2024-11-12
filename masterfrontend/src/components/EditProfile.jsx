import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, IconButton, Dialog, DialogActions, DialogContent, 
    DialogContentText, DialogTitle, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const EditProfile = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [openDialog, setOpenDialog] = useState(false);
    const user = location.state?.user;

    const [formData, setFormData] = useState({
        fname: user?.fname || "",
        lname: user?.lname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        address: user?.address || "",
        paymentType: user?.paymentType || "",
        password: "", 
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }
        
        setOpenDialog(true); 
    };

    const handleUpdate = async () => {
        if (!user?.ownerId) {
            alert("User ID is missing. Cannot update profile.");
            return;
        }

        try {
            const updateData = { 
                fname: formData.fname,
                lname: formData.lname,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                paymentType: formData.paymentType,
                password: user.password,
            };
            
            if (formData.password) {
                updateData.password = formData.password;
            }

            await axios.put(`http://localhost:8080/api/furryfriendshubowner/profile/edit/${user.ownerId}`, updateData);
            alert('Profile updated, you will have to log in again.');
            onLogout();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setOpenDialog(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">Edit Profile</Typography>
            </Box>
            <form onSubmit={handleSubmit}>
                <TextField label="First Name" name="fname" value={formData.fname} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Last Name" name="lname" value={formData.lname} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Payment Type" name="paymentType" value={formData.paymentType} onChange={handleChange} fullWidth margin="normal" />
                <TextField 
                    label="New Password" 
                    name="password" 
                    type={showPassword ? "text" : "password"}
                    value={formData.password} 
                    onChange={handleChange} 
                    fullWidth margin="normal" 
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField 
                    label="Confirm Password" 
                    name="confirmPassword" 
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword} 
                    onChange={handleConfirmPasswordChange} 
                    fullWidth margin="normal" 
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button variant="contained" color="primary" type="submit">Save Changes</Button>
                </Box>
            </form>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Update</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to save these changes to your profile?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EditProfile;