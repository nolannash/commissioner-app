import React, { useContext, useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';

const SellerItemsPage = () => {
  const { user, csrfToken } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/sellers/${user.id}/items`, {
          method: 'GET',
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data.items);
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [csrfToken, user.id]);

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`/sellers/${user.id}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });

      if (response.ok) {
        console.log('Item deleted successfully');
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Delete Item Error:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h6">Items</Typography>
      {items.length === 0 ? (
        <Typography variant="body1">No items available</Typography>
      ) : (
        items.map((item) => (
          <Card key={item.id} sx={{ marginTop: '16px' }}>
            <CardHeader title={item.name} />
            <CardContent>
              <Typography variant="body1">{item.description}</Typography>
              <Typography variant="body1">Price: ${item.price}</Typography>
            </CardContent>
            <CardActions>
              <IconButton
                color="primary"
                aria-label="edit item"
                onClick={() => {
                  // Handle edit functionality here
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                color="error"
                aria-label="delete item"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Delete />
              </IconButton>
            </CardActions>
          </Card>
        ))
      )}
    </div>
  );
};

export default SellerItemsPage;
