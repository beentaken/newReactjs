// src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import PagesMain from './Pages/PagesMain';
import ImageViewer from './ImageUi/ImageViewer';
import Sidebar, {DashboardMenu } from './sitemap/Sidebar';
import ObjectJson from './ui/ObjectJson';
import { CheckboxesGroup, ColorPickerWithDialog, FileUpload, Toastsample, OpenDoor, Dndreorder } from './ui/';
import { LayerMap1, LayerMap, MiniMapIcons, MoveImageMap } from './Map/';
import { TagFaces, Visibility, Fingerprint } from '@mui/icons-material';
import Api from "./Pages/Api";
import AnotherTabs from "./Pages/AnotherTabs";
import AnotherTabsLazy from "./Pages/AnotherTabsLazy";
import AnotherTabsConditional from "./Pages/AnotherTabsConditional";
import Memosample from "./Rendering/Memosample";
import D4 from "./date/D4";
import D5 from "./date/D5";
import './App.css';
import { D1, D2, D3 } from "./DatepickerUi/src/";

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const Contact = lazy(() => wait(1000).then(() => import('./Pages/Contact'))); 
const About = lazy(() => import('./Pages/About'));

function App() {
    const pages = [
        { title: 'Home', path: '/' },
        { title: 'Toastsample', path: '/toastsample' },
        { title: 'About', path: '/about' },
        { title: 'Contact', path: '/contact' },
        { title: 'CheckboxesGroup', path: '/CheckboxesGroup' },
        { title: 'ColorPickerWithDialog', path: '/ColorPickerWithDialog' },
        { title: 'D4', path: '/D4' },
        { title: 'D5', path: '/D5' },
        { title: 'FileUpload', path: '/FileUpload' },
        { title: 'ObjectJson', path: '/ObjectJson' },
        { title: 'Api', path: '/api' },
        { title: 'AnotherTabs', path: '/AnotherTabs' },
        { title: 'AnotherTabsLazy', path: '/AnotherTabsLazy' },
        { title: 'AnotherTabsConditional', path: '/AnotherTabsConditional' },
        { title: 'Memosample', path: '/Memosample' }, 
        { title: 'OpenDoor', path: '/OpenDoor' }, 
        { title: 'Map'}, 
        { title: 'LayerMap', path: '/LayerMap', sub: 'Map'}, 
        { title: 'LayerMap1', path: '/LayerMap1', sub: 'Map' }, 
        { title: 'MiniMapIcons', path: '/MiniMapIcons', sub: 'Map' }, 
        { title: 'MoveImageMap', path: '/MoveImageMap', sub: 'Map' }, 
        { title: 'Dndreorder', path: '/Dndreorder' }, 
        { title: 'ImageViewer', path: '/ImageViewer' }, 
        
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
                    <h1>Welcome to My App (React {React.version})</h1>
                    <DashboardMenu pages={pages} ></DashboardMenu>
                    {/* Display loading while components are being delayed */}
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<LayerMap />} />
                            <Route path="/toastsample" element={<Toastsample />} />
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
                            <Route path="/MiniMapIcons" element={<MiniMapIcons />} /> 
                            <Route path="/MoveImageMap" element={<MoveImageMap />} /> 
                            <Route path="/Dndreorder" element={<Dndreorder />} /> 
                            <Route path="/ImageViewer" element={<ImageViewer />} />                         
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </Router>
    );
} 

export default App;
