import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
    Typography,
    Button,
} from '@mui/material';

import AddSharpIcon from '@mui/icons-material/AddSharp';

import { Link } from 'react-router-dom';

const SellerItems = () => {
    const {user}=useContext(AuthContext);
    return (
        <div>
            <Typography variant="h6">Your Items</Typography>
            {/* Render items */}
            <Link to='/ItemForm'>
                <Button 
                    variant='contained' 
                    startIcon={<AddSharpIcon/>}>
                    New Item
                </Button>
            </Link>
        </div>
    );
};

export default SellerItems;