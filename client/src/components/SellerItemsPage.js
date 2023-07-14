import React, { useContext, useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Button,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const SellerItemsPage = () => {
  const { user, csrfToken } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

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
          console.log(data);
          setItems(data);
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Typography variant="h6">Items</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push('/itemForm');
          }}
        >
          New Item
        </Button>
      </Box>
      {!items || items.length === 0 ? (
        <Typography variant="body1">You do not have any items</Typography>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {items.map((item) => (
            <Card key={item.id} sx={{ margin: '8px', width: '400px' }}>
              <CardHeader title={item.name} />
              {item.images && item.images.length > 0 ? (
                <CardMedia sx={{ height: 100, paddingTop: '56.25%' }} title={`Item ${item.id}`}>
                  {item.images && item.images.length > 0 ? (
                    <CardMedia
                      component="img"
                      height="150"
                      image={`/uploads/${item.images[0].image_path}`}
                      alt={`Item ${item.id}`}
                    />
                  ) : (
                    <CardHeader title="No Image" />
                  )}
                </CardMedia>
              ) : (
                <CardContent>
                  <Typography variant="body1">No image</Typography>
                </CardContent>
              )}
              <CardContent>
                <Typography variant="body1">{item.description}</Typography>
                <Typography variant="body1">Price: ${item.price}</Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="primary"
                  aria-label="edit item"
                  onClick={() => {
                    history.push({
                      pathname: '/itemForm',
                      state: { item },
                    });
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton color="error" aria-label="delete item" onClick={() => handleDeleteItem(item.id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerItemsPage;