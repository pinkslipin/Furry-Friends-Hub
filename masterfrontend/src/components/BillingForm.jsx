import { Box, Button, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion'; // Add framer-motion

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const hoverEffect = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 }
};

const BillingForm = ({ onLogout }) => {
    const location = useLocation();
    const user = location.state?.user; // Move this line above the billingData state
    const [billingData, setBillingData] = useState({
        billingId: '',
        billingDate: '',
        amountDue: '',
        amountPaid: '',
        ownerId: '',
        vetId: user?.vetId || '' // Automatically set the vetId to the logged-in vet
    });
    const [notification, setNotification] = useState('');
    const [billings, setBillings] = useState([]);
    const [owners, setOwners] = useState([]);
    const [isEditing, setIsEditing] = useState(false);  
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', message: '', action: null });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState(null);

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
        button2: {
            backgroundColor: '#125B9A',
            color: 'white',
            '&:hover': {
                backgroundColor: '#125B9A'
            }
        },
        button: {
            backgroundColor: '#F05A7E',
            color: 'white',
            '&:hover': {
                backgroundColor: '#d64d6f'
            }
        }
    };

    useEffect(() => {
        fetchBillings();
        fetchOwners();
    }, []);

    const fetchBillings = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/billing/getAllBillingRecords');
            setBillings(response.data);
        } catch (error) {
            console.error("Error fetching billings", error);
            setNotification("Error fetching billings.");
        }
    };

    const fetchOwners = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/furryfriendshubowner/getAllOwners');
            setOwners(response.data);
        } catch (error) {
            console.error("Error fetching owners", error);
            setNotification("Error fetching owners.");
        }
    };

    const handleEditOpen = (billing) => {
        setBillingData({
            ...billing,
            billingDate: billing.billingDate ? new Date(billing.billingDate).toISOString().split('T')[0] : '',
            ownerId: billing.ownerId || ''
        });
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        resetForm();
    };

    const handleEdit = async (event) => {
        event.preventDefault();
        handleDialogOpen("Update Billing Record", "Are you sure you want to update this billing record?", async () => {
            const billingToSend = {
                ...billingData,
                ownerId: parseInt(billingData.ownerId) || 0,
                vetId: user?.vetid || 0 // Ensure vetId is set correctly
            };

            try {
                await axios.put(`http://localhost:8080/api/billing/putBillingDetails/${billingData.billingId}`, billingToSend, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setSnackbarMessage("Billing record updated successfully!");
                setOpenSnackbar(true);
                fetchBillings();
                resetForm();
                handleEditClose(); // Close the edit modal
            } catch (error) {
                console.error("Error updating billing record!", error);
                setNotification("Error updating billing record.");
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBillingData(prevState => ({
            ...prevState,
            [name]: value || ''
        }));
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        handleDialogOpen("Create Billing Record", "Are you sure you want to create this billing record?", async () => {
            const billingToSend = {
                ...billingData,
                ownerId: parseInt(billingData.ownerId) || 0,
                vetId: user?.vetid || 0 // Ensure vetId is set correctly
            };

            try {
                await axios.post('http://localhost:8080/api/billing/postBillingRecord', billingToSend, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setSnackbarMessage("Billing record created successfully!");
                setOpenSnackbar(true);
                fetchBillings();
                resetForm();
                handleAddClose(); // Close the add modal
            } catch (error) {
                console.error("Error creating billing record!", error);
                setNotification("Error creating billing record.");
            }
        });
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        handleDialogOpen("Update Billing Record", "Are you sure you want to update this billing record?", async () => {
            const billingToSend = {
                ...billingData,
                ownerId: parseInt(billingData.ownerId) || 0,
                vetId: user?.vetid || 0 // Ensure vetId is set correctly
            };

            try {
                await axios.put(`http://localhost:8080/api/billing/putBillingDetails/${billingData.billingId}`, billingToSend, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setSnackbarMessage("Billing record updated successfully!");
                setOpenSnackbar(true);
                fetchBillings();
                resetForm();
            } catch (error) {
                console.error("Error updating billing record!", error);
                setNotification("Error updating billing record.");
            }
        });
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    const handleDeleteOpen = (billing) => {
        setSelectedBilling(billing);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
        setSelectedBilling(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/billing/deleteBillingDetails/${selectedBilling.billingId}`);
            setSnackbarMessage('Billing record deleted successfully!');
            setOpenSnackbar(true);
            fetchBillings();
            handleDeleteClose();
        } catch (error) {
            console.error("Error deleting billing record!", error);
            setNotification("Error deleting billing record.");
        }
    };

    const resetForm = () => {
        setBillingData({
            billingId: '',
            billingDate: '',
            amountDue: '',
            amountPaid: '',
            ownerId: ''
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleBack = () => {
        navigate('/vethome');
    };

    const handleAddOpen = () => setAddOpen(true);
    const handleAddClose = () => setAddOpen(false);

    const PaperComponent = (props) => {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <Container maxWidth="lg" sx={{ mt: 8 }}>
            <Header onLogout={handleLogoutClick} user={user} />
            <Box sx={{ position: 'relative', mt: 4 }}>
                <IconButton onClick={handleBack} sx={{ position: 'absolute', top: 1, left: -3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" style={{ color: "#125B9A", fontWeight: 600 }}>
                        Billing Records List
                    </Typography>
                    <motion.div {...fadeIn} transition={{ delay: 0.2 }} {...hoverEffect}>
                        <Button variant="contained" onClick={handleAddOpen} sx={{ 
                            mb: 2,
                            backgroundColor: '#F05A7E',
                            '&:hover': { backgroundColor: '#d64d6f' },
                            borderRadius: '5px',
                            color: 'white',
                            padding: '8px 16px' }}>
                            Add Billing Record
                        </Button>
                    </motion.div>
                </Box>
                <TableContainer component={Paper} style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
                    <Table>
                        <TableHead style={{ backgroundColor: "#FFBE98" }}>
                            <TableRow>
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Date</TableCell>
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Amount Due</TableCell>
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Amount Paid</TableCell>
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Owner</TableCell>
                                <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {billings.map((billing, index) => (
                                <TableRow key={billing.billingId} style={{ backgroundColor: index % 2 === 0 ? "#FFF5EC" : "white" }}>
                                    <TableCell>{billing.billingDate}</TableCell>
                                    <TableCell>{billing.amountDue}</TableCell>
                                    <TableCell>{billing.amountPaid}</TableCell>
                                    <TableCell>
                                        {billing.ownerFname && billing.ownerLname ? `${billing.ownerFname} ${billing.ownerLname}` : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <motion.div {...fadeIn} transition={{ delay: 0.2 }} {...hoverEffect}>
                                            <IconButton onClick={() => handleEditOpen(billing)}>
                                                <EditIcon style={{ color: "#125B9A" }} />
                                            </IconButton>
                                        </motion.div>
                                        <motion.div {...fadeIn} transition={{ delay: 0.2 }} {...hoverEffect}>
                                            <IconButton onClick={() => handleDeleteOpen(billing)}>
                                                <DeleteIcon style={{ color: "#F05A7E" }} />
                                            </IconButton>
                                        </motion.div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog open={addOpen} onClose={handleAddClose} PaperComponent={PaperComponent}>
                    <DialogTitle style={modalStyles.dialogTitle2} id="draggable-dialog-title">Add Billing Record</DialogTitle>
                    <DialogContent style={modalStyles.dialogContent}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        name="billingDate"
                                        label="Date"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={billingData.billingDate || ''}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ min: minDate }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        name="amountDue"
                                        label="Amount Due"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={billingData.amountDue || ''}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        name="amountPaid"
                                        label="Amount Paid"
                                        variant="outlined"
                                        margin="normal"
                                        onChange={handleChange}
                                        value={billingData.amountPaid || ''}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" margin="normal" required>
                                        <InputLabel>Owner</InputLabel>
                                        <Select
                                            name="ownerId"
                                            value={billingData.ownerId || ''}
                                            onChange={handleChange}
                                            label="Owner"
                                        >
                                            <MenuItem value=""><em>Select Owner</em></MenuItem>
                                            {owners.map(owner => (
                                                <MenuItem key={owner.ownerId} value={owner.ownerId}>
                                                    {owner.fname} {owner.lname}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <DialogActions style={modalStyles.dialogActions}>
                                <Button onClick={handleAddClose} style={modalStyles.button}>
                                    Cancel
                                </Button>
                                <Button type="submit" style={modalStyles.button} autoFocus>
                                    Add
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </Box>
            <Dialog open={editOpen} onClose={handleEditClose} PaperComponent={PaperComponent}>
                <DialogTitle style={modalStyles.dialogTitle} id="draggable-dialog-title">Edit Billing Record</DialogTitle>
                <DialogContent style={modalStyles.dialogContent}>
                    <form onSubmit={handleEdit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    name="billingDate"
                                    label="Date"
                                    variant="outlined"
                                    margin="normal"
                                    onChange={handleChange}
                                    value={billingData.billingDate || ''}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: minDate }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="amountDue"
                                    label="Amount Due"
                                    variant="outlined"
                                    margin="normal"
                                    onChange={handleChange}
                                    value={billingData.amountDue || ''}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="amountPaid"
                                    label="Amount Paid"
                                    variant="outlined"
                                    margin="normal"
                                    onChange={handleChange}
                                    value={billingData.amountPaid || ''}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" margin="normal" required>
                                    <InputLabel>Owner</InputLabel>
                                    <Select
                                        name="ownerId"
                                        value={billingData.ownerId || ''}
                                        onChange={handleChange}
                                        label="Owner"
                                    >
                                        <MenuItem value=""><em>Select Owner</em></MenuItem>
                                        {owners.map(owner => (
                                            <MenuItem key={owner.ownerId} value={owner.ownerId}>
                                                {owner.fname} {owner.lname}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <DialogActions style={modalStyles.dialogActions}>
                            <Button onClick={handleEditClose} style={modalStyles.button2}>
                                Cancel
                            </Button>
                            <Button type="submit" style={modalStyles.button2} autoFocus>
                                Update
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={deleteOpen} onClose={handleDeleteClose} PaperComponent={PaperComponent}>
                <DialogTitle style={modalStyles.dialogTitle2} id="draggable-dialog-title">Delete Billing Record</DialogTitle>
                <DialogContent style={modalStyles.dialogContent}>
                    Are you sure you want to delete this billing record?
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
            <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
                <DialogTitle>{dialogContent.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogContent.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogClose(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleDialogClose(true)} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default BillingForm;