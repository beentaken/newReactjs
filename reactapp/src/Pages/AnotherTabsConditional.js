import * as React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

export default function AnotherTabsConditional() {
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
                {activeTab === 0 && <div>Item One</div>}
                {activeTab === 1 && <div>Item Two</div>}
                {activeTab === 2 && <div>Item Three</div>}
            </Box>
        </Box>
    );
}
