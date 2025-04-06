import React, { useState } from 'react';
import { ListManager } from "react-beautiful-dnd-grid";
import { Chip } from '@mui/material';
const Dndreorder = () => {
    const initialList = [
        {
            id: "0",
            Name: "N0",
        },
        {
            id: "1", Name: "N1",
        },
        {
            id: "2", Name: "N2",
        },
        {
            id: "3", Name: "N3",
        },
        {
            id: "4", Name: "N4",
        },
        {
            id: "5", Name: "N5",
        },
        {
            id: "6", Name: "N6",
        },
        {
            id: "8", Name: "N8",
        },
        {
            id: "7", Name: "N7",
        }
    ];

    const [selectedAssets, setSelectedAssets] = useState(initialList);

    const reorderList = (sourceIndex, destinationIndex) => {
        if (destinationIndex === sourceIndex) {
            return;
        }

        const newList = [...selectedAssets];

        // Swap the elements
        [newList[sourceIndex], newList[destinationIndex]] = [newList[destinationIndex], newList[sourceIndex]];

        setSelectedAssets(newList);
    }

    return (
        <div className="App">
            <ListManager
                items={selectedAssets}
                direction="horizontal"
                maxItems={6}
                render={asset => <Chip
                    style={{ margin: "3px", cursor: "grab" }}
                    label={asset.Name}
                   
                />}
                onDragEnd={reorderList}
            />
            {
                selectedAssets.map((jo, index) => (
                    <div key={index} style={{ margin: '10px 0' }}>
                        <label>{`id: ${jo.id}, Name: ${jo.Name}`}</label>
                    </div>
                ))
            }
        </div>

    );
};

export default Dndreorder;