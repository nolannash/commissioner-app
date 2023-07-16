import React, { useState, useContext, useEffect } from 'react';
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
import ItemList from './ItemList';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const UserPage = () => {
  const { user, logout,csrfToken } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState(0);
  const [orders, setOrders] = useState([]);
  const history = useHistory();

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
        const response = await fetch(`/users/${user.id}/orders`, {
        method: 'GET',
        headers: {
            'X-CSRF-TOKEN': csrfToken,
        },
        });
        if (response.ok) {

        const data = await response.json();
        setOrders(data);

        } else {

        console.error('Failed to fetch items');

        }

    } catch (error) {

        console.error('Failed to fetch items');
        
    }
    };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          {user.shopname}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Button variant='contained' onClick={()=>history.push('/')}>Home</Button>
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
      {/* Render ordersList */}
    </div>
  );
};

export default UserPage;