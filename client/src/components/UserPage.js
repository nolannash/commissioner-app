import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tab,
  Tabs,
  Popover,
} from '@mui/material';
import {

  ViewList,
  Receipt,
  AccountBox,
  DeleteSharp,
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import SellerItems from './SellerItemsPage';

const UserPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState(0);
  const [deletePopoverOpen, setDeletePopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveSection(newValue);
  };

  const handleDeleteProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
    setDeletePopoverOpen(true);
  };

  const handleDeleteProfileConfirm = async () => {
    try {
      // Perform the profile deletion API request
      // ...

      // After successful deletion
      setDeletePopoverOpen(false);
      logout();
    } catch (error) {
      console.error('Profile deletion error:', error.message);
      // Handle error if necessary
    }
  };

  const handleDeletePopoverClose = () => {
    setDeletePopoverOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return <SellerItems />;
      case 1:
        return <Orders />;
      case 2:
        return <AccountInfo handleDeleteProfileClick={handleDeleteProfileClick} />;
      default:
        return <AccountInfo handleDeleteProfileClick={handleDeleteProfileClick} />;
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          {user.shopname}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Button variant="contained" onClick={logout} sx={{ ml: 2 }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
      <Tabs
        value={activeSection}
        onChange={handleTabChange}
        centered
        indicatorColor="primary"
        textColor="primary"
        sx={{
          '& .Mui-selected': {
            bgcolor: 'primary.contrastText',
            color: 'primary.main',
          },
        }}
      >
        <Tab label="Items" icon={<ViewList />} />
        <Tab label="Orders" icon={<Receipt />} />
        <Tab label="Profile" icon={<AccountBox />} />
      </Tabs>
      {renderSection()}
      <Popover
        open={deletePopoverOpen}
        anchorEl={anchorEl}
        onClose={handleDeletePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">
            Are you sure you want to delete your profile?
          </Typography>
          <Button variant="contained" color="error" onClick={handleDeleteProfileConfirm}>
            Click here to confirm
          </Button>
        </Box>
      </Popover>
    </AppBar>
  );
};

const AccountInfo = ({ handleDeleteProfileClick }) => {
  return (
    <div>
      <Typography variant="h6">Account Information</Typography>
      <Button variant="contained" size="medium" color="secondary">
        Edit Profile
      </Button>
      <Button
        variant="contained"
        color="error"
        size="medium"
        startIcon={<DeleteSharp />}
        onClick={handleDeleteProfileClick}
      >
        Delete Profile
      </Button>
    </div>
  );
};

const Orders = () => {
  return (
    <div>
      <Typography variant="h6">Orders</Typography>
      {/* Render orders */}
    </div>
  );
};

export default UserPage;
