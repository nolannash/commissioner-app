import React from 'react';
import {
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
} from '@mui/material';

const ItemList = ({ items }) => {
  console.log(items);
  return (
    <div style={{ display: 'flex' }}>
      {items.map((item) => (
        <div key={item.id} style={{ width: 600, margin: 8 }}>
          <Card sx={{ height: 500 }}> 
            <CardHeader
              title={item.name}
              subheader={`${item.seller.shopname} - $${item.price}`}
            />
            {item.images && item.images.length > 0 ? (
              <CardMedia
                component="img"
                height={100} 
                image={`/uploads/${item.images[0].image_path}`}
                alt={`Item ${item.id}`}
              />
            ) : (
              <CardContent>
                <Typography variant="body1">No image</Typography>
              </CardContent>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ItemList;