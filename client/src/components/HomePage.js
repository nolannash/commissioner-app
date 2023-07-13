import React, { useState, useContext } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    InputBase,
    IconButton,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const HomePage = () => {

    const { user, logout } = useContext(AuthContext);


    return (
    <div>
        <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Commissioner
            </Typography>
            <Link to={'/search'}>

            <IconButton color='inherit' variant='contained' >
                <SearchIcon/>Browse
            </IconButton>

            </Link>
            {user ? (
            <>
            <Link to ={'/userPage'}>
                <Button variant='contained'color='secondary'>Profile</Button>
            </Link>
            <Link to ={'/'}>
            <Button color="error" variant='contained' onClick={logout} >
                Logout
            </Button>
            </Link>
            </>
            ) : (
            <Link to="/landing">
                <Button color="inherit" variant='contained'>Login/Signup</Button>
            </Link>
            )}
        </Toolbar>
        </AppBar>

        <div>
        <ul>
            <li>Generic Item List Goes Here</li>
            <li>"New Items" item list goes here</li>
            {user ? <li>favorites (items/shops) go here</li>:<></>}
        </ul>
        </div>
    </div>
    );
};

export default HomePage;
