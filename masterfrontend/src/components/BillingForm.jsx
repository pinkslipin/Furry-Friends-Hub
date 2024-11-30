import { Box, Button, Card, CardContent, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

const BillingForm = ({ onLogout }) => {
    const [billingData, setBillingData] = useState({
        billingId: '',
        billingDate: '',
        amountDue: '',
        amountPaid: '',
        ownerId: ''
    });
    const [notification, setNotification] = useState('');
    const [billings, setBillings] = useState([]);
    const [owners, setOwners] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

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

    const handleEdit = (billing) => {
        setBillingData({
            ...billing,
            billingDate: billing.billingDate ? new Date(billing.billingDate).toISOString().split('T')[0] : '',
            ownerId: billing.ownerId || ''
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBillingData(prevState => ({
            ...prevState,
            [name]: value || ''
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!window.confirm("Are you sure you want to create this billing record?")) return;

        const billingToSend = {
            ...billingData,
            ownerId: parseInt(billingData.ownerId) || 0
        };

        try {
            await axios.post('http://localhost:8080/api/billing/postBillingRecord', billingToSend, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setNotification("Billing record created successfully!");
            fetchBillings();
            resetForm();
        } catch (error) {
            console.error("Error creating billing record!", error);
            setNotification("Error creating billing record.");
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!window.confirm("Are you sure you want to update this billing record?")) return;

        const billingToSend = {
            ...billingData,
            ownerId: parseInt(billingData.ownerId) || 0
        };

        try {
            await axios.put(`http://localhost:8080/api/billing/putBillingDetails/${billingData.billingId}`, billingToSend, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setNotification("Billing record updated successfully!");
            fetchBillings();
            resetForm();
        } catch (error) {
            console.error("Error updating billing record!", error);
            setNotification("Error updating billing record.");
        }
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    const handleDelete = async (billingId) => {
        if (!window.confirm("Are you sure you want to delete this billing record?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/billing/deleteBillingDetails/${billingId}`);
            setNotification('Billing record deleted successfully!');
            fetchBillings();
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

    return (
        <Container maxWidth="lg" sx={{ mt: 8 }}>
            <Header onLogout={handleLogoutClick} user={user} />
            <Box sx={{ position: 'relative', mt: 4 }}>
                <IconButton onClick={handleBack} sx={{ position: 'absolute', top: 1, left: -3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" style={{ color: "#125B9A", fontWeight: 600 }}>
                        Billing Records List
                    </Typography>
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
                                        <Button variant="outlined" color="primary" onClick={() => handleEdit(billing)} style={{ marginRight: "10px", borderRadius: "5px", color: "#125B9A", borderColor: "#125B9A" }}>
                                            Edit
                                        </Button>
                                        <Button variant="outlined" color="secondary" onClick={() => handleDelete(billing.billingId)} style={{ borderRadius: "5px", color: "#F05A7E", borderColor: "#F05A7E" }}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                    <Typography variant="h4" style={{ color: "#125B9A", fontWeight: 600 }}>
                        Add Billing Record
                    </Typography>
                </Box>
                <Card sx={{ mt: 2, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
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
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, backgroundColor: '#125B9A', '&:hover': { backgroundColor: '#0e4a7a' } }}>
                                {isEditing ? 'Update Billing Record' : 'Create Billing Record'}
                            </Button>
                            {isEditing && (
                                <Button type="button" variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleCancel}>
                                    Cancel
                                </Button>
                            )}
                        </form>
                        {notification && (
                            <Typography color="error" align="center" sx={{ mt: 1 }}>
                                {notification}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default BillingForm;