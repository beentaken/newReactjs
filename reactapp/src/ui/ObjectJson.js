import React, { useState } from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';
const ObjectJson = () => {
    const [jsonObject, setJsonObject] = useState([{
        "Id": "2",
        "UIN": "222",
        "CardNumber": "22",
        "Name": "tester2",
    }, {
            "Id": "1",
            "UIN": "111",
            "CardNumber": "232",
            "Name": "tester",
        }]);
    const [jsonData, setJsonData] = useState(null);


    // Function to handle file upload
    const handledouble = (event) => {
        setJsonObject([...jsonObject.concat(jsonObject)]);
        setJsonObject([...jsonObject.concat(jsonObject)]);
        console.log(jsonObject);
        console.log(...jsonObject);
    };


    // Function to handle file upload
    const handleobjectarray = (event) => {

        var r = [{
            "Id": "3",
            "UIN": "333",
            "CardNumber": "33",
            "Name": "tester3",
        }, {
            "Id": "4",
            "UIN": "444",
            "CardNumber": "44",
            "Name": "tester4",
        }]
        setJsonObject([...jsonObject.concat(r)]);
        console.log(jsonObject);
    };

    // Function to handle file upload
    const handleobject = (event) => {

        var r = {
            "Id": "5",
            "UIN": "555",
            "CardNumber": "55",
            "Name": "tester5",
        }
        setJsonObject([...jsonObject.concat(r)]);
        console.log(jsonObject);
    };
    // Function to handle file upload
    const handleclear = (event) => {

        var r = {
            "Id": "5",
            "UIN": "555",
            "CardNumber": "55",
            "Name": "tester5",
        }
        setJsonObject([{
            "Id": "2",
            "UIN": "222",
            "CardNumber": "22",
            "Name": "tester2",
        }, {
            "Id": "1",
            "UIN": "111",
            "CardNumber": "232",
            "Name": "tester",
        }]);
        console.log(jsonObject);
    };
    return (
        <div>
            <Button variant="contained" onClick={handledouble}>
                Click handledouble!
            </Button>
            <Button variant="contained" onClick={handleobjectarray}>
                Click handleobjectarray!
            </Button>
            <Button variant="contained" onClick={handleobject}>
                Click handleobject!
            </Button>
            <Button variant="contained" onClick={handleclear}>
                clear
            </Button>
            {jsonObject.map((jo, index) => (
                <div key={index} style={{ margin: '10px 0' }}>
                    <label>{`Id: ${jo.Id}, UIN: ${jo.UIN}, Card Number: ${jo.CardNumber}, Name: ${jo.Name}`}</label>
                </div>
            ))
            }
        </div>
    );
};

export default ObjectJson;
