import React, { useContext, useEffect, useState } from 'react';
import {
    Typography,
    IconButton,
    Avatar,
    Box,
    Container,
    Button,
    Divider,
    Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ItemPage = () => {
    const { user } = useContext(AuthContext);
    const [item, setItem] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    // const isCommissionDisabled = item && item.batch_size - item.order_count === 0;
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const resp = await fetch(`/api/v1/items/${id}`);
                if (resp.ok) {
                    const data = await resp.json();
                    setItem(data);
                    setError(null);
                } else {
                    setError('Unable to fetch item');
                }
            } catch (error) {
                setError('Error fetching item');
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
                        <ArrowBack /> Home
                    </IconButton>
                </Link>
            </Box>
            {error && (
                <Box my={2}>
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                </Box>
            )}
            {item && (
                <Box my={2}>
                    <Box
                        display="flex"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                    >
                        <Avatar
                            src={`/api/v1/uploads/${item.seller.profile_photo}`}
                            alt="Profile Photo"
                        />
                        <Box ml={2}>
                            <Typography variant="h5">{item.seller.shopname}</Typography>
                            <Typography variant="body1" sx={{ padding: 1 }}>
                                {item.seller.email}
                            </Typography>
                            {item.seller.bio && (
                                <Typography variant="body1">{item.seller.bio}</Typography>
                            )}
                        </Box>
                        <Link to={`/shops/${item.seller.id}`}>
                            <Button>View Shop</Button>
                        </Link>
                    </Box>
                    {item.seller.logo_banner && (
                        <Box mt={2} sx={{ padding: 100 }}>
                            <img
                                src={`api/v1/uploads/${item.seller.logo_banner}`}
                                alt="Logo Banner"
                                style={{ width: '100%' }}
                            />
                        </Box>
                    )}
                </Box>
            )}
            <Divider></Divider>
            {item && (
                <Box my={2}>
                    <Box>
                        <img
                        src={`/api/v1/uploads/${item.images[0].image_path}`} 
                        alt ={'item image'}
                        />
                        
                    </Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                        <strong>Item Details</strong>
                        <strong>
                            <Divider></Divider>
                        </strong>
                    </Typography>
                    <Typography variant="h5">{item.name}</Typography>
                    <Typography variant="body1">{item.description}</Typography>
                    <Typography variant="body1">Price: ${item.price}</Typography>
                    <Typography variant="body1">Batch Size: {item.batch_size}</Typography>
                    <Typography variant="body1">
                        Quantity Remaining: {item.batch_size - item.order_count}
                    </Typography>
                </Box>
            )}
            {user ? (
                <Box mt={2}>
                    <Link to ={`/NewOrder/${id}`}>
                    <Button variant='outlined' color='success'
                    // disabled={isCommissionDisabled}
                    >Commission </Button></Link>
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