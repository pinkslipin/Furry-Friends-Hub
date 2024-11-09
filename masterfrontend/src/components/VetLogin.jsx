// VetLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VetLogin = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/vet/login', credentials);
            onLogin(response.data);  // Pass the vet data to the onLogin callback
            navigate('/vethome');    // Redirect to Vet Home page upon successful login
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h2>Vet Login</h2>
            <form onSubmit={handleLogin} className="vet-login-form">
                <div className="input-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={credentials.email}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={credentials.password}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="submit-button">Login</button>
            </form>
        </div>
    );
};

export default VetLogin;
