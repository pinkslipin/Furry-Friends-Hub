import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppointmentForm.css';

const AppointmentForm = () => {
    const [appointmentData, setAppointmentData] = useState({
        appointmentId: '',
        appointmentDate: '',
        appointmentTime: '', // Ensure this is handled as a time input
        status: '',
        vetId: '',
        petId: '',
        amountDue: '',
        amountPaid: ''
    });
    const [notification, setNotification] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [vets, setVets] = useState([]); // New state for vets
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
        fetchVets(); // Fetch vets when component mounts
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

    const handleEdit = (appointment) => {
        setAppointmentData({
            ...appointment,
            vetId: appointment.vets?.vetid || '',
            petId: appointment.pet?.pid || '',
            amountDue: appointment.billing?.amountDue || '',
            amountPaid: appointment.billing?.amountPaid || ''
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const vet = { vetid: appointmentData.vetId };
        const pet = { pid: appointmentData.petId };
        const billing = { amountDue: appointmentData.amountDue, amountPaid: appointmentData.amountPaid };

        const appointmentToSend = {
            ...appointmentData,
            vets: vet,
            pet: pet,
            billing: billing
        };

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (isEditing) {
            if (!window.confirm("Are you sure you want to update this appointment?")) return;

            try {
                await axios.put(`http://localhost:8080/api/appointments/updateAppointment/${appointmentData.appointmentId}`, appointmentToSend, config);
                setNotification('Appointment updated successfully!');
                resetForm();
                fetchAppointments();
            } catch (error) {
                console.error("Error updating appointment!", error);
                setNotification("Error updating appointment.");
            }
        } else {
            try {
                await axios.post('http://localhost:8080/api/appointments/postAppointment', appointmentToSend, config);
                setNotification('Appointment created successfully!');
                resetForm();
                fetchAppointments();
            } catch (error) {
                console.error("Error creating appointment!", error);
                setNotification("Error creating appointment.");
            }
        }
    };

    const handleDelete = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to delete this appointment?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/appointments/deleteAppointment/${appointmentId}`);
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
            appointmentTime: '', // Reset appointmentTime field
            status: '',
            vetId: '',
            petId: '',
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

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Edit Appointment' : 'Add Appointment'}</h2>
            <form onSubmit={handleSubmit} className="appointment-form">
                <input type="hidden" name="appointmentId" value={appointmentData.appointmentId} />
                <div className="input-group">
                    <label>Date:</label>
                    <input type="date" name="appointmentDate" onChange={handleChange} value={appointmentData.appointmentDate} required />
                </div>
                <div className="input-group">
                    <label>Time:</label>
                    <input type="time" name="appointmentTime" onChange={handleChange} value={appointmentData.appointmentTime} required />
                </div>
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
                    <label>Pet ID:</label>
                    <input type="number" name="petId" placeholder="Pet ID" onChange={handleChange} value={appointmentData.petId} required />
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
                        Veterinarian: {appointment.vets ? `${appointment.vets.fname} ${appointment.vets.lname}` : 'N/A'}
                        <br />
                        Pet: {appointment.pet ? `${appointment.pet.petName} (ID: ${appointment.pet.pid})` : 'N/A'}
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