import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <Link to="/signup">
        <Button variant="contained">Sign Up as User</Button>
      </Link>
      <Link to="/signup/seller">
        <Button variant="contained">Sign Up as Seller</Button>
      </Link>
      <Link to="/login">
        <Button variant="contained">Log In</Button>
      </Link>
      <Button variant="contained">Guest</Button>
    </div>
  );
};

export default HomePage;
