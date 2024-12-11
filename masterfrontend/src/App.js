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
import axios from 'axios';
import AdoptionAnimalList from './components/AdoptionAnimalList';
import OwnerAdoptionAnimalList from './components/OwnerAdoptionAnimalList';
import AppointmentRequest from './components/AppointmentRequest';
import MedicalRecordListOwner from './components/MedicalRecordListOwner';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // New loading state
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const validateUserRole = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                try {
                    const endpoint = parsedUser.role === 'VET' ? 'http://localhost:8080/api/vet/profile' : 'http://localhost:8080/api/furryfriendshubowner/profile';
                    const response = await axios.get(endpoint, {
                        params: { email: parsedUser.email },
                    });
                    if (response.data.role === parsedUser.role) {
                        setUser(parsedUser);
                        setIsLoggedIn(true);
                    } else {
                        // Reset the role in local storage and refresh the page
                        parsedUser.role = response.data.role;
                        localStorage.setItem('user', JSON.stringify(parsedUser));
                        window.location.reload();
                    }
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        // Revert the role to the original one stored in the backend
                        const originalRole = parsedUser.role === 'VET' ? 'OWNER' : 'VET';
                        parsedUser.role = originalRole;
                        localStorage.setItem('user', JSON.stringify(parsedUser));
                        window.location.reload();
                    } else {
                        console.error('Error validating user role', error);
                        localStorage.removeItem('user');
                        setIsLoggedIn(false);
                    }
                }
            } else {
                setIsLoggedIn(false);
            }
            setLoading(false); // Stop loading after validation
        };

        validateUserRole();
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (user && parsedUser.role !== user.role) {
                localStorage.setItem('user', JSON.stringify(user));
                window.location.reload(); // Reload the page to reset the state
            }
        }
    }, [user]);

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
                <Route path="/vetsignup" element={isLoggedIn && user.role === 'VET' ? <VetSignup user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/vethome" element={isLoggedIn && user.role === 'VET' ? <VetHome user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/ownerhome" element={isLoggedIn ? <OwnerHome user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/ownerprofile" element={<OwnerProfile user={user} onLogout={handleLogout} />} />
                <Route path="/adoption-requests" element={<AdoptionRequest user={user} onLogout={handleLogout} />} />
                <Route path="/edit-profile" element={<EditProfile user={user} onLogout={handleLogout} />} />
                <Route path="/appointmentform" element={isLoggedIn && user.role === 'VET' ? <AppointmentForm user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/ownerlist" element={<OwnerList user={user} onLogout={handleLogout} />} />
                <Route path="/vetform" element={<VetForm user={user} onLogout={handleLogout} />} />
                <Route path="/vetprofile" element={isLoggedIn && user.role === 'VET' ? <VetProfile onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/edit-vet-profile" element={isLoggedIn && user.role === 'VET' ? <EditVetProfile user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                {/* <Route path="/vetlist" element={isLoggedIn && user.role === 'VET' ? <VetList user={user} onLogout={handleLogout} /> : <Navigate to="/" />} /> */}
                <Route path="/vetlist" element={<VetList user={user} onLogout={handleLogout} />} />
                <Route path="/appointmentlist" element={<AppointmentList user={user} onLogout={handleLogout} />} />

                <Route path="/medicalrecords" element={isLoggedIn && user.role === 'VET' ? <MedicalRecordList onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/medicalrecords/add" element={isLoggedIn && user.role === 'VET' ? <MedicalRecordAdd onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/medicalrecords/view" element={isLoggedIn && user.role === 'VET' ? <MedicalRecordView onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/owner-medicalrecords" element={isLoggedIn && user.role === 'OWNER' ? <MedicalRecordListOwner user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />

                <Route path="/petform" element={<PetForm user={user} onLogout={handleLogout} />} />
                <Route path="/petsuccess" element={<PetRegistrationSuccess user={user} onLogout={handleLogout} />} />
                <Route path="/petlist" element={<PetList user={user} onLogout={handleLogout} />} />
                <Route path="/update-pet/:pid" element={<UpdatePet user={user} onLogout={handleLogout} />} />

                <Route path="/BillingForm" element={<BillingForm onLogout={handleLogout} />} />
                <Route path="/BillingList" element={<BillingList onLogout={handleLogout} />} />
                <Route 
                    path="/adoption-animals" 
                    element={isLoggedIn && user.role === 'VET' ? 
                        <AdoptionAnimalList user={user} onLogout={handleLogout} /> : 
                        <Navigate to="/" />
                    } 
                />
                <Route path="/owner-adoption-animals" 
                    element={isLoggedIn && user.role === 'OWNER' ? 
                        <OwnerAdoptionAnimalList user={user} onLogout={handleLogout} /> : 
                        <Navigate to="/" />
                    } 
                />
                <Route path="/appointmentrequest" element={isLoggedIn ? <AppointmentRequest user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
            </Routes>
        </Box>
    );
}

export default App;
