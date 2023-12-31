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
import {
  
  ViewList,
  Receipt,
  AccountBox,
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import SellerItems from './SellerItemsPage';
import SellerAccountInfo from './SellerAct';
import { useHistory } from 'react-router-dom';
import OrderListSellers from './SellerOrders';

const SellerPage = () => {

  const { user, logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState(0);
  const history = useHistory();


  const handleTabChange = (event, newValue) => {
    setActiveSection(newValue);

  };


  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return <SellerItems />;
      case 1:
        return <OrderListSellers orders={user.orders} />;

      case 2:
        return <SellerAccountInfo />;
      default:
        return <SellerAccountInfo />;
    }
  };
  if (!user) {
    return <Typography>Loading...</Typography>
  }

  return (

    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign:'center'}}>
          {user.shopname || user.seller.shopname} 
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
            alignItems: 'center', textAlign: 'center',
          },
        }}
      >
        <Tab label="Items" icon={<ViewList />} />
        <Tab label="Orders" icon={<Receipt />} />
        <Tab label="Profile" icon={<AccountBox />} />
      </Tabs>
      {renderSection()}
    </AppBar>
  );
};

export default SellerPage;