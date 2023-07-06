import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    const handleSignUp = async (userType, userData) => {
    try {
        const response = await fetch(`/api/signup/${userType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

        if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        } else {
        throw new Error('Sign up failed');
        }
    } catch (error) {
        console.error(error);
    }
    };

    const handleLogin = async (credentials) => {
    try {
        const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        });

        if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        } else {
        throw new Error('Login failed');
        }
    } catch (error) {
        console.error(error);
    }
    };

    const handleLogout = () => {
    setToken(null);
    };



    return (
        <AuthContext.Provider value={{ token, signUp: handleSignUp, login: handleLogin, logout: handleLogout }}>
        {children}
        </AuthContext.Provider>
    );
    };

export { AuthContext, AuthProvider };
