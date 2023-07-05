import React from 'react';
import "./index.css"
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom'
import App from './components/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <React.StrictMode>
    <Router>
        <App />
    </Router>
    </React.StrictMode>
);