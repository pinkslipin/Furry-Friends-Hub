import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppointmentForm.css';

const AppointmentForm = () => {
    const [appointmentData, setAppointmentData] = useState({
        appointmentId: '',
        appointmentDate: '',
        appointmentTime: '',
        status: '',
        vetId: '',
        petId: '',
        billingId: '',
        billingDate: '',
        amountDue: '',
        amountPaid: ''
    });
    const [notification, setNotification] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [vets, setVets] = useState([]);
    const [pets, setPets] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
        fetchVets();
        fetchPets();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/appointments/getAllAppointments');
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments", error);
            setNotification("Error fetching appointments.");
        }
    };

    const fetchVets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vet/getAllVets');
            setVets(response.data);
        } catch (error) {
            console.error("Error fetching vets", error);
            setNotification("Error fetching veterinarians.");
        }
    };

    const fetchPets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/pet/getAllPets');
            setPets(response.data);
        } catch (error) {
            console.error("Error fetching pets", error);
            setNotification("Error fetching pets.");
        }
    };

    const handleEdit = (appointment) => {
        setAppointmentData({
            ...appointment,
            vetId: appointment.vet?.vetid || '',
            petId: appointment.pet?.pid || '',
            billingId: appointment.billing?.billingId || '',
            billingDate: appointment.billing?.billingDate || '',
            amountDue: appointment.billing?.amountDue || '',
            amountPaid: appointment.billing?.amountPaid || ''
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const appointmentToSend = {
            ...appointmentData,
            vetId: parseInt(appointmentData.vetId),
            petId: parseInt(appointmentData.petId),
            amountDue: parseFloat(appointmentData.amountDue),
            amountPaid: parseFloat(appointmentData.amountPaid)
        };

        try {
            await axios.post('http://localhost:8080/api/appointments/postAppointment', appointmentToSend, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setNotification("Appointment created successfully!");
            fetchAppointments();
            resetForm();
        } catch (error) {
            console.error("Error creating appointment!", error);
            setNotification("Error creating appointment.");
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const billingToSend = {
            billingDate: appointmentData.billingDate,
            amountDue: parseFloat(appointmentData.amountDue),
            amountPaid: parseFloat(appointmentData.amountPaid)
        };

        const appointmentToSend = {
            ...appointmentData,
            vetId: parseInt(appointmentData.vetId),
            petId: parseInt(appointmentData.petId)
        };

        try {
            // Update billing data
            await axios.put(`http://localhost:8080/api/billing/putBillingDetails/${appointmentData.billingId}`, billingToSend, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Update appointment data
            await axios.put(`http://localhost:8080/api/appointments/putAppointmentDetails/${appointmentData.appointmentId}?petId=${appointmentData.petId}&vetId=${appointmentData.vetId}`, appointmentToSend, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setNotification("Appointment updated successfully!");
            fetchAppointments();
            resetForm();
        } catch (error) {
            console.error("Error updating appointment!", error);
            setNotification("Error updating appointment.");
        }
    };

    const handleDelete = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to delete this appointment?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/appointments/deleteAppointmentDetails/${appointmentId}`);
            setNotification('Appointment deleted successfully!');
            fetchAppointments();
        } catch (error) {
            console.error("Error deleting appointment!", error);
            setNotification("Error deleting appointment.");
        }
    };

    const resetForm = () => {
        setAppointmentData({
            appointmentId: '',
            appointmentDate: '',
            appointmentTime: '',
            status: '',
            vetId: '',
            petId: '',
            billingId: '',
            billingDate: '',
            amountDue: '',
            amountPaid: ''
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Get tomorrow's date in the required format
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Edit Appointment' : 'Add Appointment'}</h2>
            <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="appointment-form">
                <input type="hidden" name="appointmentId" value={appointmentData.appointmentId} />
                <div className="input-group">
                    <label>Date:</label>
                    <input type="date" name="appointmentDate" onChange={handleChange} value={appointmentData.appointmentDate} min={minDate} required />
                </div>
                <label>Time:</label>
                <input
                    type="time"
                name="appointmentTime"
                    onChange={handleChange}
                    value={appointmentData.appointmentTime}
                    required
                    min={
                        appointmentData.appointmentDate === new Date().toISOString().split('T')[0]
                            ? new Date().toISOString().split('T')[1].slice(0, 5) // Current time if today
                            : '00:00' // Any time for future dates
                    }
                />
                <div className="input-group">
                    <label>Status:</label>
                    <input type="text" name="status" placeholder="Status" onChange={handleChange} value={appointmentData.status} required />
                </div>
                <div className="input-group">
                    <label>Vet:</label>
                    <select name="vetId" onChange={handleChange} value={appointmentData.vetId} required>
                        <option value="">Select Vet</option>
                        {vets.map(vet => (
                            <option key={vet.vetid} value={vet.vetid}>
                                {vet.fname} {vet.lname} - {vet.specialization}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label>Pet:</label>
                    <select name="petId" onChange={handleChange} value={appointmentData.petId} required>
                        <option value="">Select Pet</option>
                        {pets.map(pet => (
                            <option key={pet.pid} value={pet.pid}>
                                {pet.petName} (ID: {pet.pid})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label>Billing Date:</label>
                    <input type="date" name="billingDate" onChange={handleChange} value={appointmentData.billingDate} min={minDate} required />
                </div>
                <div className="input-group">
                    <label>Amount Due:</label>
                    <input type="number" name="amountDue" placeholder="Amount Due" onChange={handleChange} value={appointmentData.amountDue} required />
                </div>
                <div className="input-group">
                    <label>Amount Paid:</label>
                    <input type="number" name="amountPaid" placeholder="Amount Paid" onChange={handleChange} value={appointmentData.amountPaid} required />
                </div>
                <div className="button-group">
                    <button type="submit" className="submit-button">{isEditing ? 'Update Appointment' : 'Create Appointment'}</button>
                    {isEditing && (
                        <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                    )}
                </div>
            </form>
            {notification && <p className="notification">{notification}</p>}
            <button onClick={handleBack} className="back-button">Back to Home</button>

            <h3>Appointments List</h3>
            <ul className="appointment-list">
                {appointments.map((appointment) => (
                    <li key={appointment.appointmentId} className="appointment-item">
                        {appointment.appointmentDate} {appointment.appointmentTime} - {appointment.status} 
                        <br />
                        Veterinarian: {appointment.vet ? `${appointment.vet.fname} ${appointment.vet.lname}` : 'N/A'}
                        <br />
                        Pet: {appointment.pet ? `${appointment.pet.petName} (ID: ${appointment.pet.pid})` : 'N/A'}
                        <br />
                        Billing Date: {appointment.billing ? appointment.billing.billingDate : 'N/A'}
                        <br />
                        Amount Due: {appointment.billing ? appointment.billing.amountDue : 'N/A'}
                        <br />
                        Amount Paid: {appointment.billing ? appointment.billing.amountPaid : 'N/A'}
                        <div className="appointment-buttons">
                            <button onClick={() => handleEdit(appointment)} className="edit-button">Edit</button>
                            <button onClick={() => handleDelete(appointment.appointmentId)} className="delete-button">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AppointmentForm;