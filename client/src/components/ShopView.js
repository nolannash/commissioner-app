import React, { useEffect, useState } from 'react';
import {
    Typography,
    IconButton,
    Avatar,
    Box,
    Container,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import ItemList from './ItemList';

const ShopView = () => {

    const [seller, setSeller] = useState('');
    const {id} = useParams();

    useEffect(() => {
        (async () => {
            const resp = await fetch(`/sellers/${id}`);
            if (resp.ok) {
            const data = await resp.json()
            setSeller(data);

            } else {
            console.error("Unable to Sellers Items");
            }
        })();
        }, [id]);

        console.log(seller);
        console.log(seller.items)
    return (
    <Container maxWidth="md">
        <Box my={4}>
        <Link to="/">
            <IconButton color="inherit" aria-label="back to homepage">
            <ArrowBack />
            </IconButton>
        </Link>
        <Typography variant="h5" component="h1" gutterBottom>
            Shop View
        </Typography>
        </Box>
        {seller && (
        <Box my={2}>
            <Box display="flex" alignItems="flex-start" justifyContent="flex-start">
            <Avatar src={`/uploads/${seller.profile_photo}`} alt="Profile Photo" />
            <Box ml={2}>
                <Typography variant="h5">{seller.shopname}</Typography>
                <Typography variant="body1">{seller.email}</Typography>
                {seller.bio && <Typography variant="body1">{seller.bio}</Typography>}
            </Box>
            </Box>
            {seller.logo_banner && (
            <Box mt={2}>
                <img
                src={`/uploads/${seller.logo_banner}`}
                alt="Logo Banner"
                style={{ width: '100%' }}
                />
            </Box>
            )}
        </Box>
        )}
        <Typography variant="h6" component="h2" gutterBottom>
        Seller's Items
        </Typography>
            {seller.items?<ItemList items={seller.items} />:<></>}

    </Container>
    );
};

export default ShopView;