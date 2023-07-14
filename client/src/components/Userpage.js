import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import { ViewList, Receipt, AccountBox } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import UserAccountInfo from './UserAct';
import ItemList from './itemList';

const UserPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveSection(newValue);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return <ItemList items={user.favorites} />;
      case 1:
        return <Orders />;
      case 2:
        return <UserAccountInfo></UserAccountInfo>;
      default:
        return <UserAccountInfo></UserAccountInfo>;
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
        <Tab label="Favorites" icon={<ViewList />} />
        <Tab label="Orders" icon={<Receipt />} />
        <Tab label="Profile" icon={<AccountBox />} />
      </Tabs>
      {renderSection()}
    </AppBar>
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