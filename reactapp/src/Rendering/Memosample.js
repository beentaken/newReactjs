import React from 'react';

const memosample = React.memo(function memosample(props) {
    // Your component logic
    return <div>{props.value}</div>;
});