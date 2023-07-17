import React, { createContext, useState } from 'react';
import { useHistory } from "react-router-dom";

const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const history = useHistory();


  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
  };
  
  const csrfToken = getCookie('csrf_access_token');

  const handleSignUp = async (userType, userData) => {
    try {
      const response = await fetch(`/signup/${userType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();

        userType === 'seller'?setUser(data.seller ):setUser(data.user);

      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleLogin = async (userType, credentials) => {
    try {
      const response = await fetch(`/login/${userType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();

        userType ==='seller'?setUser(data.seller):setUser(data.user);
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
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      });

      if (response.ok) {
        
        history.replace('/');
        
        await history.go(0); 
        setUser(null); 
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const refreshUser = async (id, type) => {
    try {
      const response = await fetch(`/${type}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data)
      } else {
        throw new Error(`Failed to fetch ${type} data`);
      }
    } catch (error) {
      console.error(`Refresh ${type} error:`, error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        refreshUser,
        signUp: handleSignUp,
        login: handleLogin,
        logout: handleLogout,
        csrfToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
