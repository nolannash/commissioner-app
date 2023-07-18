import React, { useContext, useState, useEffect } from 'react';
import {
    Typography,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    IconButton,
    Button,
    Alert,
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const OrderList = ({orders}) =>{
    const {user, csrfToken} = useContext(AuthContext);
}

export default OrderList;