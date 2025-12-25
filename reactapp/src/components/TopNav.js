import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { NavLink } from "react-router-dom";

const navItems = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Toast", path: "/toastsample" },
    { title: "Contact", path: "/contact" },
    { title: "Checkbox", path: "/CheckboxesGroup" },
    { title: "API", path: "/Api" },
    { title: "Map", path: "/LayerMap" },
    { title: "Image", path: "/ImageViewer" },
];

export default function TopNav() {
    const err = new Error();
    const stackLines = err.stack.split("\n");
    console.log(stackLines);
    return (
        <AppBar position="sticky" color="primary" elevation={2}>
            <Toolbar>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            component={NavLink}
                            to={item.path}
                            sx={{
                                color: "white",
                                textTransform: "none",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                },
                            }}
                        >
                            {item.title}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
