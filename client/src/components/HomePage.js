import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Logout from './Logout';

const HomePage = () => {
  const { userType } = useContext(AuthContext);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Commissioner
          </Typography>
          {userType === 'seller' || userType === 'user' ? <Logout /> : <Button Link to={'/'}xx/>}
        </Toolbar>
      </AppBar>

    <div>
      <h1>Welcome to the Homepage</h1>
      {userType === 'seller' && (
        <h2>Hello, Seller!</h2>
        // Display seller-specific content here
      )}
      {userType === 'user' && (
        <h2>Hello, User!</h2>
        // Display user-specific content here
      )}
      {userType === 'guest' && (
        <h2>Hello, Guest!</h2>
        // Display guest-specific content here
      )}
    </div>
    </div>
  );
};

export default HomePage;