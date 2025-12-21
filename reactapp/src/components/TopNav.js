import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { NavLink } from "react-router-dom";

const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Toast", path: "/toastsample" },
    { label: "Contact", path: "/contact" },
    { label: "Checkbox", path: "/CheckboxesGroup" },
    { label: "API", path: "/Api" },
    { label: "Map", path: "/LayerMap" },
    { label: "Image", path: "/ImageViewer" },
];

export default function TopNav() {
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
                            {item.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
