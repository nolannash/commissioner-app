import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    InputBase,
    IconButton,
    Avatar,
} from '@mui/material';
import { Search as SearchIcon, Checkroom, Store } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Search = ({ items, tabs }) => {
    const [searchType, setSearchType] = useState(tabs[0].type); // Default search type is the first tab

    const handleSearchTypeChange = (type) => {
        setSearchType(type);
    };

    const handleSearch = () => {
        // Implement your search logic here
        console.log('Performing search...');
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    {tabs.map((tab) => (
                        <Button
                            key={tab.type}
                            color={searchType === tab.type ? 'primary' : 'inherit'}
                            variant={searchType === tab.type ? 'contained' : 'text'}
                            onClick={() => handleSearchTypeChange(tab.type)}
                        >
                            <Avatar>
                                {tab.type === 'items' ? <Checkroom /> : tab.type === 'store' ? <Store /> : <SearchIcon />}
                            </Avatar>
                            {tab.label}
                        </Button>
                    ))}
                    <div style={{ flexGrow: 1 }} />
                    <div style={{ position: 'relative' }}>
                        <InputBase
                            placeholder={`Search ${searchType}`}
                            style={{
                                backgroundColor: 'inherit',
                                color: 'inherit',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '0.3rem',
                            }}
                        />
                        <IconButton
                            onClick={handleSearch}
                            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                        >
                            <Avatar>
                                <SearchIcon />
                            </Avatar>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {searchType === 'items' ? <p>Items search</p> : <p>Shops search</p>}
        </div>
    );
};

export default Search;