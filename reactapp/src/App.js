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


    const biooption = [
        { name: "Face", id: "0", bool: false, icon: TagFaces },
        { name: "Iris", id: "1", bool: false, icon: Visibility },
        { name: "Finger", id: "2", bool: true, icon: Fingerprint },
    ];


    const pages = [
        { title: 'Home', path: '/', element: <Home /> },
        { title: 'Toastsample', path: '/toastsample', element: <Toastsample /> },
        { title: 'About', path: '/about', element: <About /> },
        { title: 'Contact', path: '/contact', element: <Contact /> },
        { title: 'CheckboxesGroup', path: '/CheckboxesGroup', element: <CheckboxesGroup biooptions={biooption} /> },
        { title: 'ColorPickerWithDialog', path: '/ColorPickerWithDialog', element: <ColorPickerWithDialog /> },

        // DateUI
        { title: 'D1', path: '/D1', sub: 'DateUI', element: <D1 /> },
        { title: 'D2', path: '/D2', sub: 'DateUI', element: <D2 /> },

        { title: 'FileUpload', path: '/FileUpload', element: <FileUpload /> },
        { title: 'ObjectJson', path: '/ObjectJson', element: <ObjectJson /> },
        { title: 'Api', path: '/api', element: <Api /> },

        // Tabs
        { title: 'AnotherTabs', path: '/AnotherTabs', element: <AnotherTabs /> },
        { title: 'AnotherTabsLazy', path: '/AnotherTabsLazy', element: <AnotherTabsLazy /> },
        { title: 'AnotherTabsConditional', path: '/AnotherTabsConditional', element: <AnotherTabsConditional /> },
        { title: 'OpenDoor', path: '/OpenDoor', element: <OpenDoor /> },
        // Map routes
        { title: 'LayerMap', path: '/LayerMap', sub: 'Map', element: <LayerMap /> },
        { title: 'LayerMap1', path: '/LayerMap1', sub: 'Map', element: <LayerMap1 /> },
        { title: 'MiniMapIcons', path: '/MiniMapIcons', sub: 'Map', element: <MiniMapIcons /> },
        { title: 'MoveImageMap', path: '/MoveImageMap', sub: 'Map', element: <MoveImageMap /> },

        { title: 'Dndreorder', path: '/Dndreorder', element: <Dndreorder /> },
        { title: 'ImageViewer', path: '/ImageViewer', element: <ImageViewer /> },
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
                            {pages.map(page => (
                                <Route key={page.path} path={page.path} element={page.element} />
                            ))}
                            <Route path="/" element={<LayerMap />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </Router>
    );
} 

export default App;
