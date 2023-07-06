import React from 'react';
import "./index.css";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
    <Router>
        <App />
    </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();