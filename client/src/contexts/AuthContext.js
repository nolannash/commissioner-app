import React, { createContext, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  const handleSignUp = async (userType,userData) => {

    try {
      const response = await fetch(`/signup/${userType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('token', data.token);
        Cookies.set('refresh_token', data.refresh_token);

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
        console.log(data);
        Cookies.set('token', data.token);
        Cookies.set('refresh_token', data.refresh_token);
        setUser(data.user);
      } else {
        const errorData = await response.json();
        console.log(errorData)
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
        Cookies.remove('token');
        Cookies.remove('refresh_token');
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
