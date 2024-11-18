import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, Box, Button, IconButton, Toolbar, Tooltip } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../images/logo.png';
import './Header.css';

const Header = ({ onLogout, user }) => {
    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: '100%',
                color: "#333",
                backgroundColor: '#FFD7C5',
                borderBottom: 'none',
            }}
        >
            <Toolbar sx={{ padding: '0 1rem' }}>
                {/* Logo Navigation */}
                <div className="logo-container" style={{ display: 'flex', alignItems: 'center', padding: '0' }}>
                    <RouterLink
                        to={user ? (user.role === 'VET' ? '/vethome' : '/ownerhome') : '/'} 
                        state={user}
                        className="logo" 
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                    >
                        <Box
                            component="img"
                            className="logo-img"
                            src={logo}
                            alt="FurryFriends Hub Logo"
                            sx={{
                                height: 40,
                                marginRight: 1,
                                transition: 'transform 0.3s',
                            }}
                        />
                        <span className="logo-text">FurryFriends Hub</span>
                    </RouterLink>
                </div>

                {/* Main Navigation Links */}
                <div style={{ display: 'flex', justifyContent: 'center', flex: 1, marginRight: '150px' }}>
                    {user && (
                        <>
                            {/* Pets Button */}
                            <Tooltip>
                                <Button 
                                    color='#333'
                                    component={RouterLink} 
                                    to="/petform" 
                                    state={{ user }}
                                    sx={{ color: '#333', marginRight: 2, '&:hover': { color: '#FF7A7A' } }}
                                >
                                    Pets
                                </Button>
                            </Tooltip>

                            {/* Conditional Vet Button */}
                            <Tooltip>
                                <Button 
                                    color='#333'
                                    component={RouterLink} 
                                    to={user ? (user.role === 'VET' ? "/vetform" : "/vetlist") : '/'}
                                    state={{ user }}
                                    sx={{ color: '#333', marginRight: 2, '&:hover': { color: '#FF7A7A' } }}
                                >
                                    {user.role === 'VET' ? 'Vet Form' : 'Vet List'} 
                                </Button>
                            </Tooltip>

                            {/* Conditional Appointment Button */}
                            <Tooltip>
                                <Button 
                                    color='#333'
                                    component={RouterLink} 
                                    to={user.role === 'VET' ? "/appointmentform" : "/appointmentlist"}
                                    state={{ user }}
                                    sx={{ color: '#333', marginRight: 2, '&:hover': { color: '#FF7A7A' } }}
                                >
                                    {user.role === 'VET' ? 'Create Appointment' : 'Appointments'}
                                </Button>
                            </Tooltip>

                            {/* Adoption Requests Button */}
                            <Tooltip>
                                <Button
                                    color='#333'
                                    component={RouterLink}
                                    to="/adoption-requests"
                                    state={{ user }}
                                    sx={{ color: '#333', marginRight: 2, '&:hover': { color: '#FF7A7A' } }}
                                >
                                    Adoption Requests
                                </Button>
                            </Tooltip>

                            {user.role === "VET" && 
                            <Tooltip>
                                <Button
                                    color='#333'
                                    component={RouterLink} 
                                    to="/medicalrecords"
                                    state={{ user }}
                                    sx={{ color: '#333', marginRight: 2, '&:hover': { color: '#FF7A7A' } }}
                                >
                                    Medical Records
                                </Button>
                            </Tooltip>}
                        </>
                    )}
                </div>

                {/* Profile & Logout Section */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {user && (
                        <>
                            {/* Conditional Profile Button */}
                            <Tooltip>
                                <Button
                                    color='#333'
                                    component={RouterLink}
                                    to={user.role === 'VET' ? "/vetprofile" : "/ownerprofile"}
                                    state={{ user }}
                                    sx={{ color: '#333', marginRight: 2, '&:hover': { color: '#FF7A7A' } }}
                                >
                                    Profile
                                </Button>
                            </Tooltip>
                        </>
                    )}
                    {/* Logout Button */}
                    <Tooltip title="Logout" arrow>
                        <IconButton onClick={onLogout} color='#333' sx={{ color: '#333', '&:hover': { color: '#FF7A7A' } }}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
