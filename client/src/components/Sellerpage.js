import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Divider,
  Tooltip,
  Avatar,
  ListItemIcon,
} from '@mui/material';
import { Search as SearchIcon, ViewList, Receipt, AccountBox } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import SellerItems from './SellerItemsPage';
import {useHistory} from 'react-router-dom';

const SellerPage = () => {
  const { user, logout } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [activeSection, setActiveSection] = useState('');
  const history = useHistory();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    handleClose();
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'accountInfo':
        return <AccountInfo />;
      case 'items':
        return <SellerItems />;
      case 'orders':
        return <Orders />;
      default:
        return <AccountInfo />;
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // Assuming the logout function returns a Promise

      // Perform any additional actions after successful logout
      debugger
      // Redirect to the desired page
      history.push('/landing');
    } catch (error) {
      console.error('Logout error:', error.message);
      // Handle the error if necessary
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          {user.shopname}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Button variant="contained" onClick={handleLogout} sx={{ ml: 2 }}>
            Logout
          </Button>
          <Tooltip title="Account settings">
            <Button
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <AccountBox />
              </Avatar>
            </Button>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Divider />
            <MenuItem onClick={() => handleSectionClick('accountInfo')}>
              <ListItemIcon>
                <AccountBox fontSize="small" />
              </ListItemIcon>
              Account Info
            </MenuItem>
            <MenuItem onClick={() => handleSectionClick('items')}>
              <ListItemIcon>
                <ViewList fontSize="small" />
              </ListItemIcon>
              Items
            </MenuItem>
            <MenuItem onClick={() => handleSectionClick('orders')}>
              <ListItemIcon>
                <Receipt fontSize="small" />
              </ListItemIcon>
              Orders
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      {renderSection()}
    </AppBar>
  );
};

const AccountInfo = () => {
  return (
    <div>
      <Typography variant="h6">Account Information</Typography>
      {/* Render account information */}
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

export default SellerPage;
