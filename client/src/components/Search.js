import React, { useContext, useState, useEffect } from 'react';
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
import { AuthContext } from '../contexts/AuthContext';


const Search = ({ tabs }) => {
    const [searchType, setSearchType] = useState(tabs[0].type); 
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const [shops, setShops] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]); 
    const [filteredShops, setFilteredShops] = useState([]); 
    const { user, csrfToken } = useContext(AuthContext);
    const handleSearchTypeChange = (type) => {
        setSearchType(type);
    };

    const handleSearch = () => {
        console.log('Performing search...');
        if (searchType === 'items') {
            const filteredItems = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.seller.shopname.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredItems(filteredItems); 
        } else if (searchType === 'sellers') {
            const filteredShops = shops.filter((shop) => shop.shopname.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredShops(filteredShops); 
        }
    };

    const handleSearchInputChange = (event) => {
        const inputValue = event.target.value;
        setSearchQuery(inputValue);

 
        if (searchType === 'items') {
            const filteredItems = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                    item.seller.shopname.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredItems(filteredItems);
        } else if (searchType === 'sellers') {
            const filteredShops = shops.filter((shop) => shop.shopname.toLowerCase().includes(inputValue.toLowerCase()));
            setFilteredShops(filteredShops); 
        }
    };

    useEffect(() => {

        fetch('/items') 
            .then((response) => response.json())
            .then((data) => {
                setItems(data);
                setFilteredItems(data); 
            })
            .catch((error) => console.error('Error fetching items:', error));


        fetch('/sellers')
            .then((response) => response.json())
            .then((data) => {
                setShops(data);
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
