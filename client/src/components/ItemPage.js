import React, { useContext, useEffect, useState } from 'react';
import {
    Typography,
    IconButton,
    Avatar,
    Box,
    Container,
    Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import ItemList from './ItemList';
import { AuthContext } from '../contexts/AuthContext';

const ItemPage = () => {
    const { user } = useContext(AuthContext);
    const [item, setItem] = useState(null);
    const { id } = useParams();

    useEffect(() => {
    const fetchItem = async () => {
        try {
        const resp = await fetch(`/items/${id}`);
        if (resp.ok) {
            const data = await resp.json();
            setItem(data);
        } else {
            console.error('Unable to fetch item');
        }
        } catch (error) {
        console.error('Error fetching item:', error);
        }
    };

    fetchItem();
    }, [id]);



    return (
    <Container maxWidth="md">
        <Box my={4}>
        <Link to="/">
            <IconButton color="inherit" aria-label="back to homepage">
            <ArrowBack />Home
            </IconButton>
        </Link>
        </Box>
        {item && (
        <Box my={2}>
            <Box display="flex" alignItems="flex-start" justifyContent="flex-start">
            <Avatar src={`/uploads/${item.seller.profile_photo}`} alt="Profile Photo" />
            <Box ml={2}>
                <Typography variant="h5">{item.seller.shopname}</Typography>
                <Typography variant="body1" sx={{padding:1}}>{item.seller.email}</Typography>
                {item.seller.bio && <Typography variant="body1">{item.seller.bio}</Typography>}
            </Box>
            <Link to ={`/shops/${item.seller.id}`}>
                <Button>View Shop</Button>
            </Link>
            </Box>
            {item.seller.logo_banner && (
            <Box mt={2} sx={{padding:100 }}>
                <img
                    src={`/uploads/${item.seller.logo_banner}`}
                    alt="Logo Banner"
                    style={{ width: '100%' }}
                />
            </Box>
            )}
        </Box>
        )}
        {item && (
        <Box my={2}>
            <Typography variant="h6" component="h2" gutterBottom>
            Item Details
            </Typography>
            <Typography variant="h5">{item.name}</Typography>
            <Typography variant="body1">{item.description}</Typography>
            <Typography variant="body1">Price: ${item.price}</Typography>
            <Typography variant="body1">Batch Size: {item.batch_size}</Typography>
            <Typography variant='body1'>Quantity Remaining: {item.orders === 0?item.batch_size - item.orders:<> {item.batch_size} </>}</Typography>
        </Box>
        )}
        {user ? (
        <Box mt={2}>
          {/* Render an order form here */}
          {/* Add your order form component here */}
        </Box>
        ) : (
        <Box my={2}>
            <Typography variant="body1">
            Please <Link to="/landing">login or sign up</Link> to order items.
            </Typography>
        </Box>
        )}
    </Container>
    );
};

export default ItemPage;