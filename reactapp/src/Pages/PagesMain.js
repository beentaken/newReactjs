import * as React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import DragDrop from './DragDrop';
import Uploadimage from './Uploadimage';
export default function PagesMain() {
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={(e, id) => setActiveTab(id)} aria-label="basic tabs example">
                    <Tab label="Item One" value={0} />
                    <Tab label="Item Two" value={1} />
                    <Tab label="Item Three" value={2} />
                </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
                {activeTab === 0 && <DragDrop>Item One</DragDrop>}
                {activeTab === 1 && <Uploadimage>Item Two</Uploadimage>}
                {activeTab === 2 && <div>Item Three</div>}
            </Box>
        </Box>
    );
}
