import React, { useState } from 'react';
import { ListManager } from "react-beautiful-dnd-grid";
import './style.css';

const Dndreorder = () => {
    const initialList = [
        {
            id: "0",
            order: 0
        },
        {
            id: "1",
            order: 1
        },
        {
            id: "2",
            order: 2
        },
        {
            id: "3",
            order: 3
        },
        {
            id: "4",
            order: 4
        }
    ];

    const [sortedList, setSortedList] = useState(initialList);

    const sortList = (list) => {
        return list.slice().sort((first, second) => first.order - second.order);
    }

    const reorderList = (sourceIndex, destinationIndex) => {
        if (destinationIndex === sourceIndex) {
            return;
        }

        const newList = [...sortedList];

        if (destinationIndex === 0) {
            newList[sourceIndex].order = newList[0].order - 1;
            setSortedList(sortList(newList));
            return;
        }

        if (destinationIndex === newList.length - 1) {
            newList[sourceIndex].order = newList[newList.length - 1].order + 1;
            setSortedList(sortList(newList));
            return;
        }

        if (destinationIndex < sourceIndex) {
            newList[sourceIndex].order = (newList[destinationIndex].order + newList[destinationIndex - 1].order) / 2;
            setSortedList(sortList(newList));
            return;
        }

        newList[sourceIndex].order = (newList[destinationIndex].order + newList[destinationIndex + 1].order) / 2;
        setSortedList(sortList(newList));
    }

    const ListElement = ({ item: { id } }) => {
        return <div className="item"><div>{id}</div></div>;
    }

    return (
        <div className="App">
            <ListManager
                items={sortedList}
                direction="horizontal"
                maxItems={3}
                render={item => <ListElement item={item} />}
                onDragEnd={reorderList}
            />
        </div>
    );
};

export default Dndreorder;