import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Tooltip, AppBar, Button, Toolbar, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
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
                <div className="logo-container" style={{ display: 'flex', alignItems: 'center', padding: '0' }}>
                    <RouterLink
                        to="/home"
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
                        <span className="logo-text">
                            FurryFriends Hub
                        </span>
                    </RouterLink>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', flex: 1, marginRight: '150px' }}>
                    {user && (
                        <>
                            <Tooltip>
                                <Button 
                                    color= '#333'
                                    component={RouterLink} 
                                    to="/pets" 
                                    state={{ user }}
                                    sx={{ color: '#333', marginRight: 2, '&:hover': { color: '#FF7A7A' } }}
                                >
                                    Pets
                                </Button>
                            </Tooltip>

                            <Tooltip>
                                <Button 
                                    color= '#333'
                                    component={RouterLink} 
                                    to="/vet" 
                                    state={{ user }}
                                    sx={{ color: '#333', marginRight: 2, '&:hover': { color: '#FF7A7A' } }}
                                >
                                    Vet
                                </Button>
                            </Tooltip>

                            <Tooltip>
                                <Button 
                                    color= '#333'
                                    component={RouterLink} 
                                    to="/appointment" 
                                    state={{ user }}
                                    sx={{ color: '#333', marginRight: 2, '&:hover': { color: '#FF7A7A' } }}
                                >
                                    Appointment
                                </Button>
                            </Tooltip>
                            
                            <Tooltip>
                                <Button
                                    color= '#333'
                                    component={RouterLink}
                                    to="/adoption-requests"
                                    state={{ user }}
                                    sx={{ color: '#333', marginRight: 2, '&:hover': { color: '#FF7A7A' } }}
                                >
                                    Adoption Requests
                                </Button>
                            </Tooltip>
                        </>
                    )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {user && (
                        <Tooltip>
                            <Button
                                color= '#333'
                                component={RouterLink}
                                to="/profile"
                                state={{ user }}
                                sx={{ color: '#333', marginRight: 2, '&:hover': { color: '#FF7A7A' } }}
                            >
                                Profile
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip title="Logout" arrow>
                        <IconButton onClick={onLogout} color= '#333' sx={{ color: '#333', '&:hover': { color: '#FF7A7A' } }}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
