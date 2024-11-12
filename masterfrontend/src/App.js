import React, { useState } from 'react';
import { Route, Routes,  Navigate, useLocation } from 'react-router-dom';
import {  Box } from '@mui/material';
import OwnerSignup from './components/OwnerSignup';
import OwnerLogin from './components/OwnerLogin';
import VetSignup from './components/VetSignup';
import VetLogin from './components/VetLogin';
import VetHome from './components/VetHome';
import OwnerHome from './components/OwnerHome';
import OwnerProfile from './components/OwnerProfile';
import AdoptionRequest from './components/AdoptionRequest';
import EditProfile from './components/EditProfile';
import AppointmentForm from './components/AppointmentForm';
import VetForm from './components/VetForm';
import MedicalRecordForm from './components/MedicalRecordForm';
import OwnerLoginOrSignupPage from './components/OwnerLoginorSignupPage';
import VetLoginOrSignupPage from './components/VetLoginorSignupPage'; 
import VetProfile from './components/VetProfile';
import EditVetProfile from './components/EditVetProfile';
import MainHomePage from './components/MainHomePage'; // Import MainHomePage
import VetList from './components/VetList';
import AppointmentList from './components/AppointmentList';

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
                <MainHomePage /> // Use MainHomePage component
            )}

            <Routes>
            <Route path="/" element={<Navigate to={isLoggedIn ? (user?.role === 'VET' ? "/vethome" : "/ownerhome") : "/"} />} />
            <Route path="/owner-login-or-signup" element={<OwnerLoginOrSignupPage />} />
                <Route path="/vet-login-or-signup" element={<VetLoginOrSignupPage />} />
                <Route path="/owner-signup" element={<OwnerSignup />} />
                <Route path="/owner-login" element={<OwnerLogin onLogin={handleLogin} />} />
                <Route path="/vetlogin" element={<VetLogin onLogin={handleLogin} />} />
                <Route path="/vetsignup" element={<VetSignup />} />
                <Route path="/vethome" element={isLoggedIn ? <VetHome user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/ownerhome" element={isLoggedIn ? <OwnerHome user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/ownerprofile" element={isLoggedIn ? <OwnerProfile user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/adoption-requests" element={isLoggedIn ? <AdoptionRequest user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/edit-profile" element={isLoggedIn ? <EditProfile user={user} onLogout={handleLogout}/> : <Navigate to="/" />} />
                <Route path="/appointment" element={isLoggedIn ? <AppointmentForm user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/vet" element={isLoggedIn ? <VetForm user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/vetprofile" element={isLoggedIn ? <VetProfile onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/edit-vet-profile" element={isLoggedIn ? <EditVetProfile user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/vetlist" element={<VetList user={user} onLogout={handleLogout} />} />
                <Route path="/appointmentlist" element={<AppointmentList user={user} onLogout={handleLogout} />} />
                <Route path="/medicalrecord" element={isLoggedIn ? <MedicalRecordForm onLogout={handleLogout}/> : <Navigate to="/" />} />
            </Routes>
        </Box>
    );
}

export default App;