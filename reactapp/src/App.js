// src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Pages/Home';
import DragDrop from './Pages/DragDrop';
import Uploadimage from './Pages/Uploadimage';
import Sidebar from './sitemap/Sidebar';
import ObjectJson from './ui/ObjectJson';
import { CheckboxesGroup, ColorPickerWithDialog, FileUpload } from './ui/';
import { TagFaces, Visibility, Fingerprint } from '@mui/icons-material';
import Api from "./Pages/Api";
import D4 from "./date/D4";
import D5 from "./date/D5";
import './App.css';


const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const Contact = lazy(() => wait(1000).then(() => import('./Pages/Contact')));
const About = lazy(() => import('./Pages/About'));

function App() {
    const pages = [
        { title: 'Home', path: '/' },
        { title: 'About', path: '/about' },
        { title: 'Contact', path: '/contact' },
        { title: 'CheckboxesGroup', path: '/CheckboxesGroup' },
        { title: 'ColorPickerWithDialog', path: '/ColorPickerWithDialog' },
        { title: 'D5', path: '/D5' },
        { title: 'D4', path: '/D4' },
        { title: 'DragDrop', path: '/DragDrop' },
        { title: 'FileUpload', path: '/FileUpload' },
        { title: 'ObjectJson', path: '/ObjectJson' },
        { title: 'Api', path: '/api' },
        { title: 'Uploadimage', path: '/Uploadimage' },
    ]; 
    const biooption = [
        { name: "Face", id: "0", bool: false, icon: TagFaces },
        { name: "Iris", id: "1", bool: false, icon: Visibility },
        { name: "Finger", id: "2", bool: true, icon: Fingerprint },
    ];

    return (
        <Router>
            <div className="app-container">
                <div className="notices"></div>
                <Sidebar pages={pages} />
                <div className="main-content">
                    <h1>Welcome to My App</h1>
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/CheckboxesGroup">CheckboxesGroup</Link></li>
                            <li><Link to="/D4">D4</Link></li>
                            <li><Link to="/D5">D5</Link></li>
                            <li><Link to="/Api">Api</Link></li>
                            <li><Link to="/DragDrop">DragDrop</Link></li>
                            <li><Link to="/ColorPickerWithDialog">ColorPickerWithDialog</Link></li>
                            <li><Link to="/FileUpload">FileUpload</Link></li>
                            <li><Link to="/ObjectJson">ObjectJson</Link></li>
                            <li><Link to="/Uploadimage">Uploadimage</Link></li>
                        </ul>
                    </nav>

                    {/* Display loading while components are being delayed */}
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/CheckboxesGroup" element={<CheckboxesGroup biooptions={biooption} />} />
                            <Route path="/D4" element={<D4 />} />
                            <Route path="/D5" element={<D5 />} />
                            <Route path="/DragDrop" element={<DragDrop />} />
                            <Route path="/ColorPickerWithDialog" element={<ColorPickerWithDialog />} />
                            <Route path="/FileUpload" element={<FileUpload />} />
                            <Route path="/ObjectJson" element={<ObjectJson />} />
                            <Route path="/Api" element={<Api />} />
                            <Route path="/Uploadimage" element={<Uploadimage />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </Router>
    );
}

export default App;
