import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LoginPage from './Login';
import SignUpPage from './SignUp';
import LandingPage from './LandingPage';
import HomePage from './HomePage';


const App = () => {
  return (
    <AuthProvider> 
      <Router>
        <Switch>
          <Route exact path="/">
          <HomePage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup/">
            <SignUpPage />
          </Route>
          <Route path="/landing">
            <LandingPage />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;