import * as React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

export default function AnotherTabsLazy() {
    const [activeTab, setActiveTab] = React.useState(0);
    const [loadedTabs, setLoadedTabs] = React.useState([true, false, false]);

    const handleTabChange = (e, id) => {
        setActiveTab(id);
        setLoadedTabs((prev) => {
            const updated = [...prev];
            updated[id] = true;
            return updated;
        });
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Item One" value={0} />
                    <Tab label="Item Two" value={1} />
                    <Tab label="Item Three" value={2} />
                </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
                {loadedTabs[0] && activeTab === 0 && <div>Item One</div>}
                {loadedTabs[1] && activeTab === 1 && <div>Item Two</div>}
                {loadedTabs[2] && activeTab === 2 && <div>Item Three</div>}
            </Box>
        </Box>
    );
}
