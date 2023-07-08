import React, { createContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const determineUserType = () => {
    const { pathname } = location;

    if (pathname.includes('/signup/seller') || pathname.includes('/login/seller')) {
      return 'seller';
    } else if (pathname.includes('/signup/user') || pathname.includes('/login/user')) {
      return 'user';
    } else {
      return 'user';
    }
  };

  const handleSignUp = async (userData) => {
    const userType = determineUserType();

    try {
      const response = await fetch(`/signup/${userType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ type: userType, token: data.access_token });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleLogin = async (credentials) => {
    const userType = determineUserType();

    try {
      const response = await fetch(`/login/${userType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ type: userType, token: data.access_token });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setUser(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType: user ? user.type : determineUserType(),
        signUp: handleSignUp,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

