import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../images/logo.png';
import './Header.css';

const RotatingMenuIcon = styled(MenuIcon)(({ theme, open }) => ({
    transition: 'transform 0.3s',
    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
    color: '#FF7A7A',
}));

const Header = ({ onLogout, user }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: '100%',
                color: "#333",
                backgroundColor: '#FFD7C5',
                borderBottom: 'none',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s',
                // Remove hover background color change
            }}
        >
            <Toolbar sx={{ padding: '0 1rem' }}>
                {/* Logo Navigation */}
                <div className="logo-container" style={{ display: 'flex', alignItems: 'center', padding: '0' }}>
                    <RouterLink
                        to={user && user.role === 'VET' ? '/vethome' : '/ownerhome'} 
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
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                },
                            }}
                        />
                        <span className="logo-text" style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontSize: '1.5rem', color: '#FF7A7A' }}>FurryFriends Hub</span>
                    </RouterLink>
                </div>

                {/* Main Navigation Links */}
                <div style={{ display: 'flex', justifyContent: 'center', flex: 1, marginRight: '150px' }}>
                    {user && user.role !== 'VET' && (
                        <>
                            <Button component={RouterLink} to="/petlist" state={{ user }} sx={{ color: '#333', '&:hover': { color: '#FF7A7A', transform: 'scale(1.1)' }, transition: 'color 0.3s, transform 0.3s' }}>
                                Pets
                            </Button>
                            <Button component={RouterLink} to="/vetlist" state={{ user }} sx={{ color: '#333', '&:hover': { color: '#FF7A7A', transform: 'scale(1.1)' }, transition: 'color 0.3s, transform 0.3s' }}>
                                Vet List
                            </Button>
                            <Button component={RouterLink} to="/appointmentlist" state={{ user }} sx={{ color: '#333', '&:hover': { color: '#FF7A7A', transform: 'scale(1.1)' }, transition: 'color 0.3s, transform 0.3s' }}>
                                Appointments
                            </Button>
                            <Button component={RouterLink} to="/owner-adoption-animals" state={{ user }} sx={{ color: '#333', '&:hover': { color: '#FF7A7A', transform: 'scale(1.1)' }, transition: 'color 0.3s, transform 0.3s' }}>
                                Adoption Animals
                            </Button>
                            <Button component={RouterLink} to="/billinglist" state={{ user }} sx={{ color: '#333', '&:hover': { color: '#FF7A7A', transform: 'scale(1.1)' }, transition: 'color 0.3s, transform 0.3s' }}>
                                Billing
                            </Button>
                        </>
                    )}
                </div>

                {/* Profile & Logout Section */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {user && (
                        <>
                            {/* Conditional Profile Button */}
                            <Tooltip title="Profile" arrow>
                                <Button
                                    color='#333'
                                    component={RouterLink}
                                    to={user.role === 'VET' ? "/vetprofile" : "/ownerprofile"}
                                    state={{ user }}
                                    sx={{ color: '#333', marginRight: 0, '&:hover': { color: '#FF7A7A', transform: 'scale(1.1)' }, transition: 'color 0.3s, transform 0.3s' }}
                                >
                                    Profile
                                </Button>
                            </Tooltip>
                            {user && user.role === 'VET' && (
                                <>
                                    <IconButton
                                        color="inherit"
                                        aria-controls="main-menu"
                                        aria-haspopup="true"
                                        onClick={handleMenuClick}
                                        sx={{
                                            transition: 'transform 0.3s, color 0.3s',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                                color: '#FF7A7A',
                                            },
                                        }}
                                    >
                                        <RotatingMenuIcon open={open} />
                                    </IconButton>
                                    <Menu
                                        id="main-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleMenuClose}
                                        MenuListProps={{
                                            sx: {
                                                backgroundColor: '#FFD7C5',
                                                '& .MuiMenuItem-root': {
                                                    color: '#333',
                                                    '&:hover': {
                                                        backgroundColor: '#FF7A7A',
                                                        color: '#FFF',
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem component={RouterLink} to="/petlist" state={{ user }} onClick={handleMenuClose}>
                                            Pets
                                        </MenuItem>
                                        <MenuItem component={RouterLink} to="/vetform" state={{ user }} onClick={handleMenuClose}>
                                            Veterinarians
                                        </MenuItem>
                                        <MenuItem component={RouterLink} to="/ownerlist" state={{ user }} onClick={handleMenuClose}>
                                            Owners
                                        </MenuItem>
                                        <MenuItem component={RouterLink} to="/appointmentform" state={{ user }} onClick={handleMenuClose}>
                                            Create Appointment
                                        </MenuItem>
                                        <MenuItem component={RouterLink} to="/medicalrecords" state={{ user }} onClick={handleMenuClose}>
                                            Medical Records
                                        </MenuItem>
                                        <MenuItem component={RouterLink} to="/vetsignup" state={{ user }} onClick={handleMenuClose}>
                                            Vet Signup
                                        </MenuItem>
                                        <MenuItem component={RouterLink} to="/BillingForm" state={{ user }} onClick={handleMenuClose}>
                                            Billing Records
                                        </MenuItem>
                                        <MenuItem component={RouterLink} to="/adoption-animals" state={{ user }} onClick={handleMenuClose}>
                                            Adoption Animals
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}
                        </>
                    )}
                    {/* Logout Button */}
                    <Tooltip title="Logout" arrow>
                        <IconButton onClick={onLogout} color='#333' sx={{ color: '#333', '&:hover': { color: '#FF7A7A', transform: 'scale(1.1)' }, transition: 'color 0.3s, transform 0.3s' }}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
