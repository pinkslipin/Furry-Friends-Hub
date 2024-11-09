// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import PartialHome from './components/PartialHome';
// import AppointmentForm from './components/AppointmentForm';
// import VetForm from './components/VetForm';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<PartialHome />} />
//         <Route path="/appointment" element={<AppointmentForm />} />
//         <Route path="/vet" element={<VetForm />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React, { useState } from 'react';
import { Route, Routes, Link, Navigate, useLocation} from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import AdoptionRequest from './components/AdoptionRequest';
import EditProfile from './components/EditProfile';
import AppointmentForm from './components/AppointmentForm';
import VetForm from './components/VetForm';

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
                        <Button component={Link} to="/signup" variant="contained" color="primary">
                            Signup
                        </Button>
                        <Button component={Link} to="/login" variant="outlined" color="primary">
                            Login
                        </Button>
                    </Box>
                </Box>
            )}

            <Routes>
                <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/"} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/home" element={isLoggedIn ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
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

