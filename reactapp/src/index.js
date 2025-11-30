import React from 'react';
import ReactDOM from 'react-dom'; // Import from 'react-dom'
import App from './App';

// Use the ReactDOM.render method
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root') // Specify the container
);