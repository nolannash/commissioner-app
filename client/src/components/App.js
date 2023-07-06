import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './Login';
import HomePage from './HomePage';
import SignUpPage from './SignUp';
import { AuthProvider } from '../contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;