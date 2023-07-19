import React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';

const OrderListSellers = ({ orders }) => {
    return (
    <div>
        {orders.map((order, index) => (
        <Card key={index} sx={{ marginBottom: '1rem' }}>
            <CardHeader title={`Your Order with ${order.user.username}`} />
            <CardContent>
            <Typography variant="body1">
                <strong>Item:</strong> {order.item.name}
            </Typography>
            <Typography variant="body1">
                <strong>Price:</strong> ${order.item.price}
            </Typography>
            <Typography variant ='body1'><strong>Placed at: </strong>{order.created_at}</Typography>
            <Typography variant='body1'>Customer Responses: {order.user_response}</Typography>
            </CardContent>
        </Card>
        ))}
    </div>
    );
};

export default OrderListSellers;