// src/sitemap/Sidebar.js
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Sidebar.css";

export default function Route({ pages }) {
    const [openMap, setOpenMap] = useState(true);

    const mainPages = pages.filter(p => !p.sub && p.path);
    const mapPages = pages.filter(p => p.sub === "Map");

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

                {/* Map Accordion */}
                <li className="accordion">
                    <div
                        className="accordion-header"
                        onClick={() => setOpenMap(!openMap)}
                    >
                        <span>Map</span>
                        <span className={`arrow ${openMap ? "open" : ""}`}>▸</span>
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


export function DashboardMenu({ pages }) {
    const [openSubs, setOpenSubs] = useState({});

    const parents = pages.filter(p => !p.sub && !p.path);
    const normalLinks = pages.filter(p => p.path && !p.sub);

    const toggleSub = (title) => {
        setOpenSubs(prev => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <nav>
            <ul>
                {/* normal menu items */}
                {normalLinks.map(page => (
                    <li key={page.title}>
                        <Link to={page.path}>{page.title}</Link>
                    </li>
                ))}

                {/* sub menus */}
                {parents.map(parent => {
                    const isOpen = openSubs[parent.title];
                    return (
                        <li key={parent.title}>
                            <span
                                style={{ cursor: "pointer", fontWeight: "bold" }}
                                onClick={() => toggleSub(parent.title)}
                            >
                                {parent.title}
                            </span>

                            {isOpen && (
                                <ul>
                                    {pages
                                        .filter(p => p.sub === parent.title)
                                        .map(child => (
                                            <li key={child.title}>
                                                <Link to={child.path}>{child.title}</Link>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
