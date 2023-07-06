import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const LandingPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '8px',
        borderRadius: '8px',
        backgroundColor: '#f0f0f0',
        width: '45%',
        margin: '0 auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          width: '100%',
        }}
      >
        <Link to="/signup/seller" style={{ flexBasis: '45%' }}>
          <Button variant="contained" sx={{ width: '100%', padding: '8px' }}>
            Artist
          </Button>
        </Link>
        <Box
          sx={{
            position: 'relative',
            width: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <hr
            style={{
              border: 'none',
              borderTop: '1px solid #ccc',
              height: '100%',
            }}
          />
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              top: '10%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#f0f0f0',
              color: '#888',
              padding: '2px 8px',
            }}
          >
            or
          </Typography>
        </Box>
        <Link to="/signup/user" style={{ flexBasis: '45%' }}>
          <Button variant="contained" sx={{ width: '100%', padding: '8px' }}>
            User
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          width: '100%',
        }}
      >
        <Typography variant="body2">
          <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
          Already a user? Login
          </Link>
        </Typography>
        <Typography variant="body2">
          <Link to="/guest" style={{ textDecoration: 'none', color: 'inherit' }}>
            Continue as Guest
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;

