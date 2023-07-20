import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const history = useHistory();
  const updateUser = (user) => { setUser(user) }

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
      const response = await fetch(`/api/v1/signup/${userType}`, {
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
      const response = await fetch(`/api/v1/login/${userType}`, {
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
      const response = await fetch('/api/v1/logout', {
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

  const refreshUser = async (id, userType) => {
    try {
      const response = await fetch(`/api/v1/${userType}/${id}`, {
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
        throw new Error(`Failed to fetch ${userType} data`);
      }
    } catch (error) {
      console.error(`Refresh ${userType} error:`, error.message);
    }
  };

  useEffect(() => {
    (
      async () => {
        const options = {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'X-CSRF-TOKEN': getCookie('csrf_access_token'),
          },
        };
        const resp = await fetch("/api/v1/me", options)
        if (resp.ok) {
          const data = await resp.json()
          updateUser(data)
        } else {
          (async () => {
              const resp = await fetch("/api/v1/refresh_token", {
                method: "POST",
                credentials: 'same-origin',
                headers: {
                    'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
                },
              })
              if (resp.ok) {
                const data = await resp.json()

                setUser(data)
              } else {
                console.error("Please log in again")
              }
          })()
        }
      }
    )()
  }, [])

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
