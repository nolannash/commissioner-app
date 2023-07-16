import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
    Typography,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Button,
} from '@mui/material';
import { Link } from'react-router-dom';

const ShopList = ({ shops }) => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {shops.map((shop) => (
        <Card key={shop.id} sx={{ margin: '8px', width: '600px' }}>
          <CardHeader title={shop.shopname} />
          <CardMedia
            component="img"
            height={100}
            image={`/uploads/${shop.logo_banner}`}
            alt={`Shop ${shop.id}`}
          />
          <CardContent>
            <Typography variant="body1">{shop.bio}</Typography>

            <Link to={`/shops/${shop.id}`}>
              <Button variant="contained" color="primary">
                View Shop
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ShopList;