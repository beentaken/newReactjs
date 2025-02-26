import React from "react";
import {
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
    Checkbox,
    Button,
} from "@mui/material";

const OpenDoor = (props) => {
    const biooptions = props.biooptions || []; // ✅ Prevents undefined error

    const [stateo, setStateo] = React.useState(
        biooptions.reduce((acc, option) => {
            acc[option.name] = option.bool;
            return acc;
        }, {})
    );

    const handleoChange = (event) => {
        setStateo((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.checked,
        }));
    };

    const pickedCount = Object.values(stateo).filter((v) => v).length;
    const oerror = pickedCount !== 2;

    const handleBuildingShutdown = () => {
        console.log("Building shutdown triggered!");
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px" }}>
            <FormControl component="fieldset" sx={{ marginBottom: 2 }} error={oerror}>
                <FormGroup>
                    {biooptions.map((option) => (
                        <FormControlLabel
                            key={option.name}
                            control={
                                <Checkbox
                                    checked={stateo[option.name] || false}
                                    onChange={handleoChange}
                                    name={option.name}
                                />
                            }
                            label={option.name}
                        />
                    ))}
                </FormGroup>
                {oerror && <FormHelperText>Pick exactly 2 options</FormHelperText>}
            </FormControl>

            <Button
                sx={{
                    border: "1px solid rgb(57, 60, 67)",
                    cursor: "pointer",
                    padding: "5px",
                    height: 40,
                    minWidth: 150,
                    backgroundColor: "transparent",
                    "&:hover": { backgroundColor: "rgba(57, 60, 67, 0.1)" },
                }}
                onClick={handleBuildingShutdown}
            >
                Shutdown Building
            </Button>
        </div>
    );
};

export default OpenDoor;
