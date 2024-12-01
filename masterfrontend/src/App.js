import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AdoptionRequest from './components/AdoptionRequest';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import BillingForm from './components/BillingForm';
import BillingList from './components/BillingList';
import EditProfile from './components/EditProfile';
import EditVetProfile from './components/EditVetProfile';
import MainHomePage from './components/MainHomePage';
import MainLogin from './components/MainLogin';
import MedicalRecordAdd from './components/MedicalRecordAdd';
import MedicalRecordList from './components/MedicalRecordList';
import MedicalRecordView from './components/MedicalRecordView';
//import OwnerForm from './components/OwnerForm';
import OwnerHome from './components/OwnerHome';
import OwnerProfile from './components/OwnerProfile';
import OwnerSignup from './components/OwnerSignup';
import PetForm from './components/PetForm';
import PetList from './components/PetList';
import PetRegistrationSuccess from './components/PetRegistrationSuccess';
import UpdatePet from './components/UpdatePet';
import VetForm from './components/VetForm';
import VetHome from './components/VetHome';
import VetList from './components/VetList';
import VetProfile from './components/VetProfile';
import VetSignup from './components/VetSignup';
import OwnerList from './components/OwnerList';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // New loading state
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate fetching user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false); // Stop loading after state restoration
    }, []);

    const handleLogin = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Logged in user:', userData);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Show a loading screen while restoring state
    if (loading) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
            <Routes>
                <Route path="/" element={<MainHomePage />} />
                <Route path="/login" element={<MainLogin onLogin={handleLogin} />} />
                <Route path="/owner-signup" element={<OwnerSignup />} />
                <Route path="/vetsignup" element={isLoggedIn ? <VetSignup user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/vethome" element={isLoggedIn ? <VetHome user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/ownerhome" element={isLoggedIn ? <OwnerHome user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/ownerprofile" element={<OwnerProfile user={user} onLogout={handleLogout} />} />
                <Route path="/adoption-requests" element={<AdoptionRequest user={user} onLogout={handleLogout} />} />
                <Route path="/edit-profile" element={<EditProfile user={user} onLogout={handleLogout} />} />
                <Route path="/appointmentform" element={<AppointmentForm user={user} onLogout={handleLogout} />} />
                <Route path="/ownerlist" element={<OwnerList user={user} onLogout={handleLogout} />} />
                <Route path="/vetform" element={<VetForm user={user} onLogout={handleLogout} />} />
                <Route path="/vetprofile" element={<VetProfile onLogout={handleLogout} />} />
                <Route path="/edit-vet-profile" element={<EditVetProfile user={user} onLogout={handleLogout} />} />
                <Route path="/vetlist" element={<VetList user={user} onLogout={handleLogout} />} />
                <Route path="/appointmentlist" element={<AppointmentList user={user} onLogout={handleLogout} />} />

                <Route path="/medicalrecords" element={<MedicalRecordList onLogout={handleLogout} />} />
                <Route path="/medicalrecords/add" element={isLoggedIn ? <MedicalRecordAdd onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/medicalrecords/view" element={isLoggedIn ? <MedicalRecordView onLogout={handleLogout} /> : <Navigate to="/" />} />

                <Route path="/petform" element={<PetForm user={user} onLogout={handleLogout} />} />
                <Route path="/petsuccess" element={<PetRegistrationSuccess user={user} onLogout={handleLogout} />} />
                <Route path="/petlist" element={<PetList user={user} onLogout={handleLogout} />} />
                <Route path="/update-pet/:pid" element={<UpdatePet user={user} onLogout={handleLogout} />} />

                <Route path="/BillingForm" element={<BillingForm onLogout={handleLogout} />} />
                <Route path="/BillingList" element={<BillingList onLogout={handleLogout} />} />
            </Routes>
        </Box>
    );
}

export default App;
