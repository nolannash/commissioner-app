import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './Login';
import SignUpPage from './SignUp';
import LogoutButton from './Logout';
import { AuthProvider } from '../contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signup" component={SignUpPage} />
          {/* Other routes */}
        </Switch>
        <LogoutButton />
      </Router>
    </AuthProvider>
  );
};

export default App;


