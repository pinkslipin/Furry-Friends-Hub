import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, IconButton, Dialog, DialogActions, DialogContent, 
    DialogContentText, DialogTitle, InputAdornment, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Header from './Header';
import axios from 'axios';

const EditProfile = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [openDialog, setOpenDialog] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
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

    useEffect(() => {
        if (user?.ownerId) {
            axios
                .get(`http://localhost:8080/api/furryfriendshubowner/profile/image/${user.ownerId}`, {
                    responseType: 'arraybuffer',
                })
                .then((response) => {
                    const arrayBufferView = new Uint8Array(response.data);
                    const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
                    const imageUrl = URL.createObjectURL(blob);
                    setImage(imageUrl);
                })
                .catch((error) => console.error('Error fetching image:', error));
        }
    }, [user]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value); 
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const specialCharacter = /[!@#$%^&*(),.?":{}|<>]/;
        if (password.length < minLength && !specialCharacter.test(password)){
            setPasswordError('Password must be at least 8 characters long and must contain at least one special character.');
            return false;
        }
        if (password.length < minLength) {
            setPasswordError('Password must be at least 8 characters long.');
            return false;
        }
        if (!specialCharacter.test(password)) {
            setPasswordError('Password must contain at least one special character.');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        if (formData.password && !validatePassword(formData.password)) {
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

            if (image) {
                updateData.image = formData.image; 
            }
            
            if (formData.password) {
                updateData.password = formData.password;
            }
            else {
                updateData.password = user.password;
            }

            const response = await axios.put(`http://localhost:8080/api/furryfriendshubowner/profile/edit/${user.ownerId}`, updateData);
            alert('Profile updated successfully.');
            navigate('/ownerprofile', { state: { user: response.data } });
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setOpenDialog(false);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('ownerId', user.ownerId);
            formData.append('image', file);

            try {
                setImageLoading(true);
                const response = await axios.post('http://localhost:8080/api/furryfriendshubowner/profile/uploadImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error uploading image:', error);
            } finally {
                setImageLoading(false);
            }
        }
    };

    return (
        <>
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Header onLogout={handleLogoutClick} user={user} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4">Edit Profile</Typography>
                </Box>
                <Box display="flex" justifyContent="center" mb={2}>
                    {image ? (
                        <img src={image} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                    ) : (
                        <Typography variant="body1">No profile picture</Typography>
                    )}
                </Box>
                <Box display="flex" justifyContent="center" mb={2}>
                        <Button variant="contained" component="label" disabled={imageLoading}>
                            {imageLoading ? <CircularProgress size={24} /> : 'Upload Picture'}
                            <input type="file" hidden onChange={handleImageUpload} />
                        </Button>
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
                        type={showConfirmPassword ? "text" : "password"}  // Separate visibility toggle for confirm password
                        value={confirmPassword} 
                        onChange={handleConfirmPasswordChange} 
                        fullWidth margin="normal" 
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {passwordError && (
                            <Typography color="error" align="center" sx={{ mt: 1 }}>
                                {passwordError}
                            </Typography>
                    )}

                    
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button
                            variant="outlined"
                            type="submit"
                            sx={{
                                borderRadius: '30px',
                                padding: '10px 20px',
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                '&:hover': { borderColor: '#115293', color: '#115293' },
                            }}
                        >
                            Save Changes
                        </Button>
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
        </>
    );
};

export default EditProfile;
