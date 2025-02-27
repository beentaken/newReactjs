// src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Pages/Home';
import PagesMain from './Pages/PagesMain';
import Sidebar from './sitemap/Sidebar';
import ObjectJson from './ui/ObjectJson';
import { CheckboxesGroup, ColorPickerWithDialog, FileUpload, WebCamera, OpenDoor, LayerMap1, LayerMap, Map } from './ui/';
import { TagFaces, Visibility, Fingerprint } from '@mui/icons-material';
import Api from "./Pages/Api";
import AnotherTabs from "./Pages/AnotherTabs";
import AnotherTabsLazy from "./Pages/AnotherTabsLazy";
import AnotherTabsConditional from "./Pages/AnotherTabsConditional";
import Memosample from "./Rendering/Memosample";
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
        { title: 'FileUpload', path: '/FileUpload' },
        { title: 'ObjectJson', path: '/ObjectJson' },
        { title: 'Api', path: '/api' },
        { title: 'AnotherTabs', path: '/AnotherTabs' },
        { title: 'AnotherTabsLazy', path: '/AnotherTabsLazy' },
        { title: 'AnotherTabsConditional', path: '/AnotherTabsConditional' },
        { title: 'Memosample', path: '/Memosample' }, 
        { title: 'OpenDoor', path: '/OpenDoor' }, 
        { title: 'LayerMap', path: '/LayerMap' }, 
        { title: 'LayerMap1', path: '/LayerMap1' }, 
        { title: 'Map', path: '/Map' }, 
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
                            <li><Link to="/AnotherTabs">AnotherTabs</Link></li>
                            <li><Link to="/AnotherTabsLazy">AnotherTabsLazy</Link></li>
                            <li><Link to="/AnotherTabsConditional">AnotherTabsConditional</Link></li>
                            <li><Link to="/ColorPickerWithDialog">ColorPickerWithDialog</Link></li>
                            <li><Link to="/FileUpload">FileUpload</Link></li>
                            <li><Link to="/ObjectJson">ObjectJson</Link></li>
                            <li><Link to="/OpenDoor">OpenDoor</Link></li>
                            <li><Link to="/LayerMap">LayerMap</Link></li>
                            <li><Link to="/LayerMap1">LayerMap1</Link></li>
                            <li><Link to="/Map">Map</Link></li>
                        </ul>
                    </nav>

                    {/* Display loading while components are being delayed */}
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<LayerMap />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/CheckboxesGroup" element={<CheckboxesGroup biooptions={biooption} />} />
                            <Route path="/D4" element={<D4 />} />
                            <Route path="/D5" element={<D5 />} />
                            <Route path="/ColorPickerWithDialog" element={<ColorPickerWithDialog />} />
                            <Route path="/FileUpload" element={<FileUpload />} />
                            <Route path="/ObjectJson" element={<ObjectJson />} />
                            <Route path="/Api" element={<Api />} />
                            <Route path="/AnotherTabs" element={<AnotherTabs />} />
                            <Route path="/AnotherTabsLazy" element={<AnotherTabsLazy />} />
                            <Route path="/AnotherTabsConditional" element={<AnotherTabsConditional />} />
                            <Route path="/PagesMain" element={<PagesMain />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/OpenDoor" element={<OpenDoor />} />
                            <Route path="/LayerMap1" element={<LayerMap1 />} />
                            <Route path="/Map" element={<Map />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </Router>
    );
}

export default App;
