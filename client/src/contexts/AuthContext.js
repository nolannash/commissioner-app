import React from 'react';

export const AuthContext = React.createContext();

const initialState = {
    isLoggedIn: false,
    user: null,
};

export const AuthProvider = ({ children }) => {
    const [state, setState] = React.useState(initialState);

    const signUp = async (userData) => {
    // Make API request to sign up endpoint
    // Update state with user data and set isLoggedIn to true
};

    const login = async (credentials) => {
    // Make API request to login endpoint
    // Update state with user data and set isLoggedIn to true
};

    const logout = () => {
    // Make API request to logout endpoint
    // Clear user data from state and set isLoggedIn to false
    };

    return (
        <AuthContext.Provider value={{ state, signUp, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
