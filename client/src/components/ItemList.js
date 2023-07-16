import React, { useContext, useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  IconButton,
  Button,
} from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ItemList = ({ items }) => {
  const { user, csrfToken, refreshUser } = useContext(AuthContext);
  const [favoriteItemIds, setFavoriteItemIds] = useState([]);

  useEffect(() => {
    if (user && user.favorites) {
      setFavoriteItemIds(user.favorites);
    }
  }, [user]);

  useEffect(() => {

    const initialFavorites = items.filter((item) => favoriteItemIds.includes(item.id));
    initialFavorites.forEach((item) => {
      const updatedItemIds = [...favoriteItemIds, item.id];
      setFavoriteItemIds(updatedItemIds);
    });
  }, [items, favoriteItemIds]);

  const isItemInFavorites = (itemId) => {
    return favoriteItemIds.includes(itemId);
  };

  const addToFavorites = (itemId) => {
    fetch(`/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ item_id: itemId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFavoriteItemIds([...favoriteItemIds, itemId]);
        refreshUser(user.id,'user');
      })
      .catch((error) => {

        console.error(error);
      });
  };

  const removeFromFavorites = (itemId) => {

    fetch(`/favorites/${itemId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFavoriteItemIds(favoriteItemIds.filter((id) => id !== itemId));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFavoriteClick = (itemId) => {
    if (isItemInFavorites(itemId)) {
      removeFromFavorites(itemId);
    } else {
      addToFavorites(itemId);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {items.map((item) => (
        <div key={item.id} style={{ width: 600, margin: 8 }}>
          <Card sx={{ height: 400 }}>
            <CardHeader
              title={item.name}
              subheader={`${item.seller.shopname} - $${item.price}`}
              action={
                user ? (
                  <IconButton onClick={() => handleFavoriteClick(item.id)}>
                    {isItemInFavorites(item.id) ? <Star /> : <StarBorder />}
                  </IconButton>
                ) : null
              }
            />
            {item.images && item.images.length > 0 ? (
              <CardMedia
                component="img"
                style={{ height: '150px', paddingTop: '2%' }}
                image={`/uploads/${item.images[0].image_path}`}
                alt={`Item ${item.id}`}
              />
            ) : (
              <CardContent>
                <Typography variant="body1">No image</Typography>
              </CardContent>
            )}
            <CardContent>
              <Typography variant='body1'>{item.description}</Typography>
            </CardContent>
            <CardContent>
              <Link to={`/items/${item.id}`}>
                <Button variant="contained" color="primary">View Item</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
