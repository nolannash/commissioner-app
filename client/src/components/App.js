import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CssBaseline } from '@mui/material';
import LoginPage from './Login';
import SignUpPage from './SignUp';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import SellerPage from './Sellerpage';


const App = () => {
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
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;