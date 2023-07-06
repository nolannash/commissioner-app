import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import LoginPage from './Login';
import SignUpPage from './SignUp';
import { AuthContext } from '../contexts/AuthContext';
import LandingPage from './LandingPage';
import HomePage from './HomePage';

const App = () => {
  const { userType } = useContext(AuthContext);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/login">
          {userType ? <Redirect to="/" /> : <LoginPage />}
        </Route>
        <Route path="/signup">
          {userType ? <Redirect to="/" /> : <SignUpPage />}
        </Route>
        <Route>
          <HomePage /> {/* Fallback route for unknown paths */}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
