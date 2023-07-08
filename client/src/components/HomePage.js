import React, { useState, useContext } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    InputBase,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LogoutButton = ({ onLogout }) => {
    return (
    <Button color="inherit" onClick={onLogout}>
        Logout
    </Button>
    );
};

const HomePage = () => {
    const [searchText, setSearchText] = useState('');
    const { user, logout } = useContext(AuthContext);

    const handleSearch = (event) => {
    setSearchText(event.target.value);
    // Handle search logic here
    };

    const handleLogout = () => {
    logout();
    };

    return (
    <div>
        <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Commissioner
            </Typography>
            <div>
            <SearchIcon />
            <InputBase
                placeholder="Search..."
                value={searchText}
                onChange={handleSearch}
            />
            </div>
            {user ? (
            <>
            <Link to ={'/UserProfile'}>
            <Button>Profile</Button>
            </Link>
            <LogoutButton onLogout={handleLogout} />
            </>
            ) : (
            <Link to="/landing">
                <Button color="inherit">Login/Signup</Button>
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
