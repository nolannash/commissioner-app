import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LoginPage from './Login';
import SignUpPage from './SignUp';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
// import PrivateRoute from './PrivateRoute';

const App = () => {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Router>
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignUpPage />
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;