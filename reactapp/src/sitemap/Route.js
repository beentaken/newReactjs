// src/sitemap/Sidebar.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ pages }) {
    const [openMap, setOpenMap] = useState(true);

    const mainPages = pages.filter(p => !p.sub && p.path);
    const mapPages = pages.filter(p => p.sub === "/Map");

    return (
        <aside className="sidebar">
            <h2 className="sidebar-title">Menu</h2>

            <ul className="sidebar-list">
                {mainPages.map(page => (
                    <li key={page.path}>
                        <NavLink
                            to={page.path}
                            className={({ isActive }) =>
                                isActive ? "sidebar-link active" : "sidebar-link"
                            }
                        >
                            {page.title}
                        </NavLink>
                    </li>
                ))}
                <li className="accordion">
                    <div
                        className="accordion-header"
                        onClick={() => setOpenMap(!openMap)}
                    >
                        <span>Map</span>
                        <span className={`arrow ${openMap ? "open" : ""}`}>></span>
                    </div>

                    {openMap && (
                        <ul className="accordion-content">
                            {mapPages.map(page => (
                                <li key={page.path}>
                                    <NavLink
                                        to={page.path}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "sidebar-link sub active"
                                                : "sidebar-link sub"
                                        }
                                    >
                                        {page.title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;