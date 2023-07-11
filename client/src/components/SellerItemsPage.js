import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Menu,
    MenuItem,
    Divider,
    Box,
    Tooltip,
    Avatar,
    ListItemIcon
} from '@mui/material';
import AddSharpIcon from '@mui/icons-material/AddSharp';
const SellerItems = () => {
    const {user}=useContext(AuthContext);
    return (
        <div>
            <Typography variant="h6">Your Items</Typography>
            {/* Render items */}
            <Button 
                variant='contained' 
                Link='/ItemForm'
                startIcon={<AddSharpIcon/>}
            ></Button>
        </div>
    );
};

export default SellerItems;