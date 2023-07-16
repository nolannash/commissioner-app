import React, { useState, useContext, useEffect } from 'react';
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
import ItemList from './itemList';
import ShopList from './ShopList';

const HomePage = () => {
    const [mainItems, setMainItems] = useState([]);
    const [newItems, setNewItems] = useState([]);
    const [userFavorites, setUserFavorites] = useState([]);
    const [newShops, setNewShops] = useState([]);

    useEffect(() => {
    fetchItems();
    }, []);

    const { user, logout, refreshUser, csrfToken } = useContext(AuthContext);

  // Function to fetch items and update state
    const fetchItems = async () => {
    try {
        const response = await fetch('/items', {
        method: 'GET',
        headers: {
            'X-CSRF-TOKEN': csrfToken,
        },
        });
        if (response.ok) {
        const data = await response.json();
        setMainItems(data);
        } else {
        console.error(response.statusText);
        console.error('Failed to fetch items');
        }
    } catch (error) {
        console.error(error);
    }
    };

  // Function to fetch new items and update state
    const fetchNewItems = async () => {
    // Implement the API request to fetch new items
    try {
        const response = await fetch('/recent', {
        method: 'GET',
        headers: {
            'X-CSRF-TOKEN': csrfToken,
        },
        });
        if (response.ok) {
        const data = await response.json();
        setNewItems(data.recent_items);
        setNewShops(data.recent_shops);
        } else {
        console.error(response.statusText);
        console.error('Failed to fetch new items');
        }
    } catch (error) {
        console.error(error);
    }
    };

  // Function to fetch user favorites and update state
    const fetchUserFavorites = async () => {
    // Check if the user is signed in before making the request
    if (!user) {
        return;
    }

    // Implement the API request to fetch user favorites
    try {
        const response = await fetch(`/users/${user.id}/favorites`, {
        method: 'GET',
        headers: {
            'X-CSRF-TOKEN': csrfToken,
        },
        });
        if (response.ok) {
        const data = await response.json();
        setUserFavorites(data);
        } else {
        console.error(response.statusText);
        console.error('Failed to fetch user favorites');
        }
    } catch (error) {
        console.error(error);
    }
    };

  // Call the functions to fetch new items and user favorites whenever needed
    useEffect(() => {
    fetchNewItems();
    fetchUserFavorites();
  }, [user]); // The useEffect will be triggered whenever the user state changes (sign-in/sign-out)

    return (
    <div>
        <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Commissioner
            </Typography>
            <Link to={'/search'}>
            <IconButton color="inherit" variant="contained">
                <SearchIcon />Browse
            </IconButton>
            </Link>
            {user ? (
            <>
                <Link to="/userPage">
                <Button variant="contained" color="secondary">
                    Profile
                </Button>
                </Link>
                <Link to="/">
                <Button color="error" variant="contained" onClick={logout}>
                    Logout
                </Button>
                </Link>
            </>
            ) : (
            <Link to="/landing">
                <Button color="inherit" variant="contained">
                Login/Signup
                </Button>
            </Link>
            )}
        </Toolbar>
        </AppBar>

        <div>
        <ul>
            <li>Generic Item List Goes Here</li>
            <ItemList items={mainItems}></ItemList>
            <li>"New Items" item list goes here</li>
            <ItemList items={newItems}></ItemList>
            <li>New Shops Go Here</li>
            <ShopList shops={newShops}></ShopList>
            {user ? <ItemList items={userFavorites}></ItemList> : <></>}
        </ul>
        </div>
    </div>
    );
};

export default HomePage;