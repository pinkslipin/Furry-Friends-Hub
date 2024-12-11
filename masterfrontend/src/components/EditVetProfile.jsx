import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Container, TextField, Button, Box, Typography, Alert, FormControl, InputLabel, Select, MenuItem,
    InputAdornment, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    CircularProgress, Snackbar // Add Snackbar here
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from './Header';
import axios from 'axios';

const EditVetProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const user = location.state?.user;
    const [formData, setFormData] = useState({
        vetid: '',
        fname: '',
        lname: '',
        email: '',
        phoneNum: '',
        specialization: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Add this state
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Add this state
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Add this state

    useEffect(() => {
        if (user && user.vetid) {
            setFormData({
                vetid: user.vetid,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                phoneNum: user.phoneNum,
                specialization: user.specialization,
                password: '',
            });
            fetchImage(user.vetid); // Fetch the image when the component mounts
        } else {
            setError("Vet data not available. Please go back and try again.");
        }
    }, [user]);

    const fetchImage = async (vetid) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/vet/profile/image/${vetid}`, {
                responseType: 'arraybuffer',
            });
            const arrayBufferView = new Uint8Array(response.data);
            const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            setImage(imageUrl);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const specialCharacter = /[!@#$%^&*(),.?":{}|<>]/;
        if (password.length < minLength || !specialCharacter.test(password)) {
            setPasswordError('Password must be at least 8 characters long and contain at least one special character.');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSaveChanges = () => {
        // Open the confirmation dialog
        setOpenDialog(true);
    };

    const handleConfirmSave = async () => {
        setOpenDialog(false);

        if (formData.password && formData.password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        if (formData.password && !validatePassword(formData.password)) {
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8080/api/vet/putVetDetails`, 
                { ...formData },
                { params: { vetid: formData.vetid } }
            );
            setSnackbarMessage('Profile updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/vetprofile', { state: { user: response.data } });
            }, 2000); // Delay navigation by 2 seconds
        } catch (error) {
            console.error('Error updating vet profile:', error);
            setSnackbarMessage('An error occurred while updating the profile. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('vetId', user.vetid);
            formData.append('image', file);

            try {
                setImageLoading(true);
                await axios.post('http://localhost:8080/api/vet/uploadImage', formData, {
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
                fetchImage(user.vetid); // Re-fetch the image after upload
            }
        }
    };

    const onLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Header user={user} onLogout={onLogout} />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">Edit Vet Profile</Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={(e) => e.preventDefault()}>
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
                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    disabled
                />
                <TextField
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    name="phoneNum"
                    value={formData.phoneNum}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Specialization</InputLabel>
                    <Select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        label="Specialization"
                    >
                        <MenuItem value="Small Animal Practice">Small Animal Practice</MenuItem>
                        <MenuItem value="Large Animal Practice">Large Animal Practice</MenuItem>
                        <MenuItem value="Mixed Animal Practice">Mixed Animal Practice</MenuItem>
                    </Select>
                </FormControl>
                <TextField 
                    label="New Password" 
                    name="password" 
                    type={showPassword ? "text" : "password"}
                    value={formData.password} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
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
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword} 
                    onChange={handleConfirmPasswordChange} 
                    fullWidth 
                    margin="normal" 
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
                        onClick={handleSaveChanges}
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
                    <Button onClick={handleConfirmSave} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Set duration to 3000 milliseconds (3 seconds)
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default EditVetProfile;
