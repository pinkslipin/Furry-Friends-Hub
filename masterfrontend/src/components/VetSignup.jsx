// VetSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VetSignup = () => {
    const [vetData, setVetData] = useState({
        fname: '',
        lname: '',
        specialization: '',
        phoneNum: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'VET'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setVetData({ ...vetData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (vetData.password !== vetData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/vet/postvetrecord', vetData);
            navigate('/vetlogin');
        } catch (err) {
            setError('Error signing up. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h2>Vet Signup</h2>
            <form onSubmit={handleSignup} className="vet-signup-form">
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
                    <input type="tel" name="phoneNum" placeholder="Phone Number" onChange={handleChange} value={vetData.phoneNum} required />
                </div>
                <div className="input-group">
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} value={vetData.email} required />
                </div>
                <div className="input-group">
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} value={vetData.password} required />
                </div>
                <div className="input-group">
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} value={vetData.confirmPassword} required />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="submit-button">Sign Up</button>
            </form>
        </div>
    );
};

export default VetSignup;
