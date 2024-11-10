// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async (email) => {
        try {
            const response = await axios.get('http://localhost:8080/api/furryfriendshubowner/profile', {
                params: { email }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initialize the user state if email is in session storage (persist across page refreshes)
        const email = sessionStorage.getItem('userEmail');
        if (email) {
            fetchUserData(email);
        } else {
            setLoading(false);  // If no email, loading is complete
        }
    }, []);

    const login = (email) => {
        sessionStorage.setItem('userEmail', email);
        fetchUserData(email);
    };

    const logout = () => {
        sessionStorage.removeItem('userEmail');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
