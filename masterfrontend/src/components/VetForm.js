// src/components/VetForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VetForm.css'; // Import CSS for styling

const VetForm = () => {
    const [vetData, setVetData] = useState({
        vetid: '',
        fname: '',
        lname: '',
        specialization: '',
        phoneNum: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [notification, setNotification] = useState('');
    const [vets, setVets] = useState([]); // State to hold all vets
    const [isEditing, setIsEditing] = useState(false); // To track if editing
    const navigate = useNavigate();

    // Fetch all vets on component mount
    useEffect(() => {
        fetchVets();
    }, []);

    const fetchVets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vet/getAllVets');
            setVets(response.data);
        } catch (error) {
            console.error("Error fetching vets", error);
            setNotification("Error fetching veterinarians.");
        }
    };

    const handleChange = (e) => {
        setVetData({ ...vetData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEditing) {
            if (!window.confirm("Are you sure you want to update this record?")) return;

            // Update vet
            try {
                await axios.put(`http://localhost:8080/api/vet/putVetDetails?vetid=${vetData.vetid}`, vetData);
                setNotification('Veterinarian updated successfully!');
                resetForm();
                fetchVets();
            } catch (error) {
                console.error("Error updating veterinarian!", error);
                setNotification("Error updating veterinarian.");
            }
        } else {
            // Create vet
            try {
                await axios.post('http://localhost:8080/api/vet/postvetrecord', vetData);
                setNotification('A new veterinarian has been added successfully!');
                resetForm();
                fetchVets();
            } catch (error) {
                console.error("Error creating veterinarian!", error);
                setNotification("Error adding veterinarian.");
            }
        }
    };  

    const handleEdit = (vet) => {
        setVetData({
            ...vet,
            password: '',
            confirmPassword: ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (vetid) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/vet/deleteVet/${vetid}`);
            setNotification('Veterinarian deleted successfully!');
            fetchVets();
        } catch (error) {
            console.error("Error deleting veterinarian!", error);
            setNotification("Error deleting veterinarian.");
        }
    };

    const resetForm = () => {
        setVetData({
            vetid: '',
            fname: '',
            lname: '',
            specialization: '',
            phoneNum: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Edit Veterinarian' : 'Add Veterinarian'}</h2>
            <form onSubmit={handleSubmit} className="vet-form">
                <input type="hidden" name="vetid" value={vetData.vetid} />
                <div className="input-group">
                    <input type="text" name="fname" placeholder="First Name" onChange={handleChange} value={vetData.fname} required />
                </div>
                <div className="input-group">
                    <input type="text" name="lname" placeholder="Last Name" onChange={handleChange} value={vetData.lname} required />
                </div>
                <div className="input-group">
                    <input type="text" name="specialization" placeholder="Specialization" onChange={handleChange} value={vetData.specialization} required />
                </div>
                <div className="input-group">
                    <input type="text" name="phoneNum" placeholder="Phone Number" onChange={handleChange} value={vetData.phoneNum} required />
                </div>
                <div className="input-group">
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} value={vetData.email} required />
                </div>
                <div className="input-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={vetData.password}
                        required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                <div className="input-group">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        value={vetData.confirmPassword}
                        required
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                </div>
                <div className="button-group">
                    <button type="submit" className="submit-button">{isEditing ? 'Update Vet' : 'Create Vet Account'}</button>
                    {isEditing && (
                        <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                    )}
                </div>
            </form>
            {notification && <p className="notification">{notification}</p>}
            <button onClick={handleBack} className="back-button">Back to Home</button>

            <h3>Veterinarians List</h3>
            <ul className="vet-list">
                {vets.map((vet) => (
                    <li key={vet.vetid} className="vet-item">
                        {vet.fname} {vet.lname} - {vet.specialization} 
                        <div className="vet-buttons">
                            <button onClick={() => handleEdit(vet)} className="edit-button">Edit</button>
                            <button onClick={() => handleDelete(vet.vetid)} className="delete-button">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VetForm;
