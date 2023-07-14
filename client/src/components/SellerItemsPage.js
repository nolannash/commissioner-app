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
  Popover,
  TextField,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const SellerItemsPage = () => {
  const { user, csrfToken } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItemId, setEditItemId] = useState(null);

  const [editItemData, setEditItemData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    batchSize: '',
    rolloverPeriod: '',
  });
  const [isEditPopoverOpen, setIsEditPopoverOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/sellers/${user.id}/items`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data)) {
            setItems(data);
          } else {
            setItems([]);
          }
        } else {
          history.push('/itemForm');
        }

        setLoading(false);
      } catch (error) {
        console.error('An error occurred while fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [csrfToken, user.id, history]);

  const handleDeleteItem = (itemId) => {
    setDeleteItemId(itemId);
    setIsDeletePopoverOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/sellers/${user.id}/items/${deleteItemId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });

      if (response.ok) {
        console.log('Item deleted successfully');
        setItems((prevItems) => prevItems.filter((item) => item.id !== deleteItemId));
        setIsDeletePopoverOpen(false);
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Delete Item Error:', error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeletePopoverOpen(false);
  };

  const handleEditButtonClick = (item) => {
    setEditItemId(item.id);
    setEditItemData({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      batchSize: item.batchSize || '',
      rolloverPeriod: item.rolloverPeriod || '',
    });
  };

  const handleEditItemChange = (event) => {
    const { name, value } = event.target;
    setEditItemData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConfirmEdit = () => {
    setIsEditPopoverOpen(true);
  };

  const handleCancelEdit = () => {
    setEditItemId(null);
    setEditItemData({
      id: '',
      name: '',
      description: '',
      price: '',
      batchSize: '',
      rolloverPeriod: '',
    });
  };

  const handleEditItemSubmit = async () => {
    try {
      const response = await fetch(`/sellers/${user.id}/items/${editItemData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(editItemData),
      });

      if (response.ok) {
        console.log('Item updated successfully');
        setIsEditPopoverOpen(false);
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === editItemData.id ? { ...item, ...editItemData } : item))
        );
        setEditItemId(null);
      } else {
        console.error('Failed to update item');
      }
    } catch (error) {
      console.error('Edit Item Error:', error);
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
        <Button variant="contained" color="primary" onClick={() => history.push('/itemForm')}>
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
                      src={`/uploads/${item.images[0].image_path}`}
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
              {editItemId === item.id ? (
                <CardContent>
                  <TextField label="Name" name="name" value={editItemData.name} onChange={handleEditItemChange} />
                  <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={editItemData.description}
                    onChange={handleEditItemChange}
                  />
                  <TextField label="Price" name="price" type="number" value={editItemData.price} onChange={handleEditItemChange} />
                  <TextField
                    label="Batch Size"
                    name="batchSize"
                    type="number"
                    value={editItemData.batchSize}
                    onChange={handleEditItemChange}
                  />
                  <TextField
                    label="Rollover Period"
                    name="rolloverPeriod"
                    type="number"
                    value={editItemData.rolloverPeriod}
                    onChange={handleEditItemChange}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <Button variant="contained" color="primary" onClick={handleConfirmEdit}>
                      Confirm Edit
                    </Button>
                  </Box>
                </CardContent>
              ) : (
                <CardContent>
                  <Typography variant="body1">{item.description}</Typography>
                  <Typography variant="body1">Price: ${item.price}</Typography>
                  {item.batchSize && <Typography variant="body1">Batch Size: {item.batchSize}</Typography>}
                  {item.rolloverPeriod && <Typography variant="body1">Rollover Period: {item.rolloverPeriod} days</Typography>}
                </CardContent>
              )}
              <CardActions>
                {!editItemId && (
                  <>
                    <IconButton color="primary" aria-label="edit item" onClick={() => handleEditButtonClick(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" aria-label="delete item" onClick={() => handleDeleteItem(item.id)}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
          ))}
        </div>
      )}

      <Popover
        open={isEditPopoverOpen || isDeletePopoverOpen}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography>Are you sure you want to {isEditPopoverOpen ? 'edit' : 'delete'} this item?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={isEditPopoverOpen ? handleEditItemSubmit : handleConfirmDelete}>
              Yes
            </Button>
            <Button variant="contained" color="error" onClick={isEditPopoverOpen ? handleCancelEdit : handleCancelDelete}>
              No
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default SellerItemsPage;