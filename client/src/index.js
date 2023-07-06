import React from 'react';
import "./index.css"
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import App from './components/App';
import reportWebVitals from './reportWebVitals';

const root = document.getElementById('root');
render(

    <React.StrictMode>
    <Router>
        <App />
    </Router>
    </React.StrictMode>,
    root
);
reportWebVitals();