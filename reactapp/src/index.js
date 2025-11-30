import React from 'react';
import ReactDOM from 'react-dom'; 
import App from './App';

// Use the ReactDOM.render method
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Specify the container
);



// src/index.js (or main entry file)
//import { createRoot } from 'react-dom/client';
//import App from './App';

//const root = createRoot(document.getElementById('root'));
//root.render(<App />);