import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    InputBase,
    IconButton,
    Avatar,
    Box,
} from '@mui/material';
import { Search as SearchIcon, Checkroom, Store, ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ItemList from './ItemList';
import ShopList from './ShopList';

const Search = ({ tabs }) => {
    const [searchType, setSearchType] = useState(tabs[0].type); // Default search type is the first tab
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const [shops, setShops] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]); // State variable for filtered items
    const [filteredShops, setFilteredShops] = useState([]); // State variable for filtered shops
    console.log(shops)
    const handleSearchTypeChange = (type) => {
        setSearchType(type);
    };

    const handleSearch = () => {
        // Implement your search logic here (no need to use this function for real-time search)
        console.log('Performing search...');
        if (searchType === 'items') {
            const filteredItems = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.seller.shopname.toLowerCase().includes(searchQuery.toLowerCase())
            );
            console.log('Filtered Items:', filteredItems);
            setFilteredItems(filteredItems); // Update the filtered items state
        } else if (searchType === 'sellers') {
            const filteredShops = shops.filter((shop) => shop.shopname.toLowerCase().includes(searchQuery.toLowerCase()));
            console.log('Filtered Shops:', filteredShops);
            setFilteredShops(filteredShops); // Update the filtered shops state
        }
    };

    const handleSearchInputChange = (event) => {
        const inputValue = event.target.value;
        setSearchQuery(inputValue);

        // Filter items and shops based on the search query and search type ('items' or 'sellers')
        if (searchType === 'items') {
            const filteredItems = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                    item.seller.shopname.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredItems(filteredItems); // Update the filtered items state
        } else if (searchType === 'sellers') {
            const filteredShops = shops.filter((shop) => shop.shopname.toLowerCase().includes(inputValue.toLowerCase()));
            setFilteredShops(filteredShops); // Update the filtered shops state
        }
    };

    useEffect(() => {
        // Fetch items from the API when the component mounts
        fetch('/items') // Replace '/items' with the appropriate API endpoint to fetch the items from the backend
            .then((response) => response.json())
            .then((data) => {
                setItems(data);
                setFilteredItems(data); // Initialize filtered items with all items initially
            })
            .catch((error) => console.error('Error fetching items:', error));


        fetch('/sellers')
            .then((response) => response.json())
            .then((data) => {
                setShops(data);
                console.log(data);
                setFilteredShops(data); 
            })
            .catch((error) => console.error('Error fetching sellers:', error));
    }, []);

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton component={Link} to="/" color="inherit" sx={{ marginRight: 2 }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Search
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box display="flex" justifyContent="center" mt={2}>
                <Box maxWidth="600px" width="100%" position="relative">
                    <InputBase
                        placeholder={`Search ${searchType === 'items' ? 'items' : 'sellers'}`}
                        style={{
                            backgroundColor: 'inherit',
                            color: 'inherit',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '0.3rem',
                            width: '100%',
                        }}
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                    <IconButton
                        onClick={handleSearch}
                        style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                    >
                        <Avatar>
                            <SearchIcon />
                        </Avatar>
                    </IconButton>
                </Box>
            </Box>
            <AppBar position="static" color="default">
                <Toolbar>
                    {tabs.map((tab) => (
                        <Button
                            key={tab.type}
                            color={searchType === tab.type ? 'primary' : 'inherit'}
                            variant={searchType === tab.type ? 'contained' : 'text'}
                            onClick={() => handleSearchTypeChange(tab.type)}
                        >
                            <Avatar>
                                {tab.type === 'items' ? <Checkroom /> : tab.type === 'sellers' ? <Store /> : <SearchIcon />}
                            </Avatar>
                            {tab.label}
                        </Button>
                    ))}
                </Toolbar>
            </AppBar>
            {searchType === 'items' ? <ItemList items={filteredItems}  /> : <ShopList shops={filteredShops} />}
        </div>
    );
};

export default Search;
