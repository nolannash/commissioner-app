import React, { useState, useContext, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Grid,
    Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ItemList from './ItemList';
import ShopList from './ShopList';

const HomePage = () => {
    const [mainItems, setMainItems] = useState([]);
    const [newItems, setNewItems] = useState([]);
    const [userFavorites, setUserFavorites] = useState([]);
    const [newShops, setNewShops] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
    fetchItems();
    fetchNewItems();
    fetchUserFavorites();
    }, []);

    const { user, logout, csrfToken } = useContext(AuthContext);


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

        setError('Failed to fetch items');

        }

    } catch (error) {

        setError('Failed to fetch items');
        
    }
    };

    const fetchNewItems = async () => {

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
        console.log(data+'4');
        console.log(data.recent_items+'3');
        console.log(data.recent_shops+'2');

        setNewShops(data.recent_shops);

        } else {

        setError('Failed to fetch new items');

        }
    } catch (error) {
        
        setError('Failed to fetch new items');
    }
    };

    const fetchUserFavorites = async () => {
    if (!user) {
        return;
    }

    try {
        const response = await fetch(`/favorites`, {
        method: 'GET',
        headers: {
            'X-CSRF-TOKEN': csrfToken,
        },
        });
        if (response.ok) {
        const data = await response.json();
        console.log(data+'5');
        setUserFavorites(data.items);
        } else {
        setError('Something went wrong')
        }
    } catch (error) {
        console.error('Failed to fetch user favorites');
    }
    };

    return (
    <div>
        <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Commissioner
            </Typography>
            <Link to={'/search'}>
            <IconButton color="inherit" variant="contained" sx={{text_align: "centered"}}>
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

        <div style={{ padding: '16px' }}>
        {error && (
            <Alert severity="error" onClose={() => setError(null)}>
            {error}
            </Alert>
        )}
        <Grid container spacing={2}>
            {!user ? (
            <Grid item xs={12} sm={4}>
                <Typography variant="h5">Generic Item List</Typography>
                <ItemList items={mainItems} />
            </Grid>
            ) : userFavorites ? (
            <Grid item xs={12} sm={4}>
                <Typography variant="h5">User Favorites</Typography>
                <ItemList items={userFavorites} />
            </Grid>
            ) : (
            <Grid item xs={12} sm={4}>
                <Typography variant="h5">User Favorites</Typography>
                <Typography variant="body1">You Don't Have Any Favorites Yet</Typography>
            </Grid>
            )}

            <Grid item xs={12} sm={4}>
            <Typography variant="h5">New Shops</Typography>
            <ShopList shops={newShops} />
            </Grid>

            <Grid item xs={12} sm={4}>
            <Typography variant="h5">New Items</Typography>
            <ItemList items={newItems} />
            </Grid>
        </Grid>
        </div>
    </div>
    );
};

export default HomePage;