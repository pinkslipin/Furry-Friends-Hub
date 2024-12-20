import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';

function BillingList() {
    const navigate = useNavigate();
    const [billings, setBillings] = useState([]);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const fetchBillings = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/billing/getBillingRecordsByOwner/${user.ownerId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch billings: ${response.statusText} - ${errorText}`);
            }
    
            const data = await response.json();
            setBillings(data);
        } catch (error) {
            console.error("Error fetching billings:", error);
            setError(error.message);
            setBillings([]);
        }
    };

    useEffect(() => {
        if (user?.ownerId) {
            fetchBillings();
        }
    }, [user?.ownerId]);

    const handlePay = (billing) => {
        setSelectedBilling(billing);
        setPaymentAmount('');
        setPaymentType('');
        setPaymentError('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBilling(null);
        setPaymentAmount('');
        setPaymentType('');
        setPaymentError('');
    };

    const handlePayment = async () => {
        if (!selectedBilling || !paymentAmount || !paymentType) return;

        const amountDue = selectedBilling.amountDue - selectedBilling.amountPaid;
        if (parseFloat(paymentAmount) > amountDue) {
            setPaymentError('Payment amount cannot exceed the amount due.');
            return;
        }

        try {
            await axios.put(`http://localhost:8080/api/billing/addPayment/${selectedBilling.billingId}`, {
                paymentAmount: parseFloat(paymentAmount),
                paymentType: paymentType
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            handleClose();
            window.location.reload(); // Refresh the page after payment
        } catch (error) {
            console.error("Error making payment", error);
        }
    };

    const isBillingOverdue = (billingDate) => {
        const today = new Date();
        const billingDateObj = new Date(billingDate);
        return billingDateObj < today;
    };

    if (error) {
        return (
            <Container maxWidth="lg" style={{ paddingTop: "2em" }}>
                <Typography variant="h6" color="error" align="center">
                    {error}
                </Typography>
            </Container>
        );
    }

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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                                    <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Status</TableCell>
                                    <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Issued By</TableCell> {/* Add Vet column */}
                                    <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {billings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center"> {/* Update colspan to 6 */}
                                            No bills to pay at this time.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    billings.map((billing, index) => (
                                        <TableRow key={billing.billingId} style={{ backgroundColor: index % 2 === 0 ? "#FFF5EC" : "white" }}>
                                            <TableCell>{billing.billingDate}</TableCell>
                                            <TableCell>{billing.amountDue}</TableCell>
                                            <TableCell>{billing.amountPaid}</TableCell>
                                            <TableCell>
                                                {isBillingOverdue(billing.billingDate) ? (
                                                    <Typography color="error">Billing Overdue</Typography>
                                                ) : (
                                                    billing.amountDue === billing.amountPaid ? 'Paid' : 'Pending'
                                                )}
                                            </TableCell>
                                            <TableCell>Doc. {billing.vetName}</TableCell> {/* Display vet's name */}
                                            <TableCell>
                                                {billing.amountDue === billing.amountPaid ? (
                                                    <Button variant="contained" disabled sx={{ marginRight: "10px", borderRadius: "5px", backgroundColor: "green", color: "white" }}>
                                                        Paid
                                                    </Button>
                                                ) : (
                                                    <Button variant="outlined" color="primary" onClick={() => handlePay(billing)} style={{ marginRight: "10px", borderRadius: "5px", color: "#125B9A", borderColor: "#125B9A" }}>
                                                        Pay
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Pay Billing</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the amount you want to pay for billing ID {selectedBilling?.billingId}.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Payment Amount"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        error={!!paymentError}
                        helperText={paymentError}
                    />
                    <Select
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                    >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Debit Card">Debit Card</MenuItem>
                        <MenuItem value="Credit Card">Credit Card</MenuItem>
                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                        <MenuItem value="Gcash">Gcash</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handlePayment} color="primary">
                        Pay
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default BillingList;