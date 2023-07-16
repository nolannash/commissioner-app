import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CssBaseline } from '@mui/material';
import LoginPage from './Login';
import SignUpPage from './SignUp';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import SellerPage from './Sellerpage';
import ItemForm from './ItemForm';
import UserPage from './Userpage';
import Search from './Search';
import ShopView from './ShopView';
import ItemPage from './ItemPage';

const App = () => {
  const tabs = [
    { type: 'items', label: 'Items' },
    { type: 'sellers', label: 'Shops' },
];

  return (
    <AuthProvider> 
      <CssBaseline/>
      <Router>
        <Switch>
          <Route exact path="/">
          <HomePage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignUpPage />
          </Route>
          <Route path="/landing">
            <LandingPage />
          </Route>
          <Route path='/sellerPage'>
            <SellerPage></SellerPage>
          </Route>
          <Route path = '/itemForm'>
            <ItemForm></ItemForm>
          </Route>
          <Route path='/userPage'>
            <UserPage/>
          </Route>
          <Route path='/search'>
            <Search tabs={tabs}></Search>
          </Route>
          <Route path='/shops/:id'>
            <ShopView></ShopView>
          </Route>
          <Route path='/items/:id'>
            <ItemPage></ItemPage>
          </Route>
          <Route path='/newOrder'>

          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;