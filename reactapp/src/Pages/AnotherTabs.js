import * as React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

export default function AnotherTabs() {
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <div>
            <button>Example Button</button>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={(e, id) => setActiveTab(id)}>
                        <Tab label="Item One" value={0} />
                        <Tab label="Item Two" value={1} />
                        <Tab label="Item Three" value={2} />
                    </Tabs>
                </Box>
                <Box style={{ display: activeTab === 0 ? '' : 'none' }}>
                    Item One
                </Box>
                <Box style={{ display: activeTab === 1 ? '' : 'none' }}>
                    Item Two
                </Box>
                <Box style={{ display: activeTab === 2 ? '' : 'none' }}>
                    Item Three
                </Box>
            </Box>
        </div>
    );
}