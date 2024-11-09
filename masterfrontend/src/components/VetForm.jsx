import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './VetForm.css';

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

    const [notification, setNotification] = useState('');
    const [vets, setVets] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

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

    const validateForm = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;

        if (!vetData.password || !passwordRegex.test(vetData.password)) {
            newErrors.password = 'Password must be 8-12 characters long and include at least 1 number and 1 special character.';
        }
        if (vetData.password !== vetData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        if (!vetData.specialization) {
            newErrors.specialization = 'Specialization is required.';
        }
        if (!vetData.phoneNum) {
            newErrors.phoneNum = 'Phone number is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (isEditing) {
            if (!window.confirm("Are you sure you want to update this record?")) return;

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
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleBack = () => {
        navigate(-1);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                    <select name="specialization" value={vetData.specialization} onChange={handleChange} required>
                        <option value="">Select Specialization</option>
                        <option value="Small Animal Practice">Small Animal Practice</option>
                        <option value="Large Animal Practice">Large Animal Practice</option>
                        <option value="Mixed Animal Practice">Mixed Animal Practice</option>
                    </select>
                    {errors.specialization && <p className="error">{errors.specialization}</p>}
                </div>
                <div className="input-group">
                    <input type="tel" name="phoneNum" placeholder="Phone Number" onChange={handleChange} value={vetData.phoneNum} required />
                    {errors.phoneNum && <p className="error">{errors.phoneNum}</p>}
                </div>
                <div className="input-group">
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} value={vetData.email} required />
                </div>
                <div className="input-group password-group" style={{ position: 'relative' }}>
                <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={vetData.password}
                        required
                    />
                    <i
                        className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleShowPassword();
                        }}
                        style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', pointerEvents: 'auto'}}                    
                        />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>
                <div className="input-group password-group" style={{ position: 'relative' }}>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        value={vetData.confirmPassword}
                        required
                    />
                    <i
                        className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleShowConfirmPassword();
                        }}
                        style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', pointerEvents: 'auto'}}                    
                        />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                </div>
                <div className="center-button">
                    <button type="submit" className="submit-button">
                        {isEditing ? 'Update Vet' : 'Create Vet Account'}
                    </button>
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
