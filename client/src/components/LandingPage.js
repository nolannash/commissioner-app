import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Commissioner
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            component={Link}
            to="/signup/seller"
            variant="contained"
            sx={{ width: '100%', padding: '8px' , position:"relative"}}
          >
            Sign up as Seller
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            component={Link}
            to="/signup/user"
            variant="contained"
            sx={{ width: '100%', padding: '8px',position:"relative" }}
          >
            Sign up as User
          </Button>
        </Grid>
      </Grid>

      <Typography variant="body1" component="p" sx={{text_align:'center'}} gutterBottom>
        Already have an account? Login below:
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            component={Link}
            to="/login/seller"
            variant="contained"
            sx={{ width: '100%', padding: '8px' }}
          >
            Login as Seller
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            component={Link}
            to="/login/user"
            variant="contained"
            sx={{ width: '100%', padding: '8px' }}
          >
            Login as User
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LandingPage;