import React, { useState } from 'react';
import { Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import OwnerSignup from './components/OwnerSignup';
import OwnerLogin from './components/OwnerLogin';
import VetSignup from './components/VetSignup';
import VetLogin from './components/VetLogin';
import VetHome from './components/VetHome';
import OwnerHome from './components/OwnerHome';
import Profile from './components/Profile';
import AdoptionRequest from './components/AdoptionRequest';
import EditProfile from './components/EditProfile';
import AppointmentForm from './components/AppointmentForm';
import VetForm from './components/VetForm';
import OwnerLoginOrSignupPage from './components/OwnerLoginorSignupPage';
import VetLoginOrSignupPage from './components/VetLoginorSignupPage'; // Uncomment this line

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    
    const handleLogin = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        console.log('Logged in user:', userData);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
            {location.pathname === '/' && !isLoggedIn && (
                <Box className="landing-page">
                    <Typography variant="h3" gutterBottom>
                        Furry Friends Hub
                    </Typography>
                    <Typography variant="h6" paragraph>
                        Your go-to place for adopting furry friends!
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <Button component={Link} to="/owner-login-or-signup" variant="contained" color="primary">
                            Owner Portal
                        </Button>
                        <Button component={Link} to="/vet-login-or-signup" variant="outlined" color="primary">
                            Vet Portal
                        </Button>
                    </Box>
                </Box>
            )}

            <Routes>
                <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/"} />} />
                <Route path="/owner-login-or-signup" element={<OwnerLoginOrSignupPage />} />
                <Route path="/vet-login-or-signup" element={<VetLoginOrSignupPage />} />
                <Route path="/owner-signup" element={<OwnerSignup />} />
                <Route path="/owner-login" element={<OwnerLogin onLogin={handleLogin} />} />
                <Route path="/vetlogin" element={<VetLogin onLogin={handleLogin} />} />
                <Route path="/vetsignup" element={<VetSignup />} />
                <Route path="/vethome" element={<VetHome />} />
                <Route path="/home" element={isLoggedIn ? <OwnerHome user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/profile" element={isLoggedIn ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/adoption-requests" element={isLoggedIn ? <AdoptionRequest user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/edit-profile" element={isLoggedIn ? <EditProfile user={user} onLogout={handleLogout}/> : <Navigate to="/" />} />
                <Route path="/appointment" element={isLoggedIn ? <AppointmentForm user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/vet" element={isLoggedIn ? <VetForm user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
            </Routes>
        </Box>
    );
}

export default App;
