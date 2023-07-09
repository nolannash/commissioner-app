import React, { createContext, useState } from 'react';
import { Cookies } from 'react-cookie';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const cookies = new Cookies()
  const history = useHistory();

  const handleSignUp = async (userType,userData) => {

    try {
      const response = await fetch(`/signup/${userType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        cookies.set('token', data.token);
        cookies.set('refresh_token', data.refresh_token);
        setUser(data.user);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleLogin = async (userType,credentials) => {
    try {
      const response = await fetch(`/login/${userType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        cookies.set('token', data.token);
        cookies.set('refresh_token', data.refresh_token);
        console.log(data.user);
        console.log(data);
        setUser(data.user);

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
      });

      if (response.ok) {
        setUser(null); // Clear the user state upon successful logout
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  }
  return (
    <AuthContext.Provider
      value={{
        user,
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
