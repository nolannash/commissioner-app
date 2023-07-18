import React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';

const OrderListUsers = ({ orders }) => {
    return (
    <div>
        {orders.map((order, index) => (
        <Card key={index} sx={{ marginBottom: '1rem' }}>
            <CardHeader title={`Your Order with ${order.item.seller.shopname}`} />
            <CardContent>
            <Typography variant="body1">
                <strong>Item:</strong> {order.item.name}
            </Typography>
            <Typography variant="body1">
                <strong>Price:</strong> ${order.item.price}
            </Typography>
            <Typography variant ='body1'>Placed at: {order.created_at}</Typography>
            </CardContent>
        </Card>
        ))}
    </div>
    );
};

export default OrderListUsers;