// src/sitemap/Sidebar.js
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ pages }) {
    const [openSubs, setOpenSubs] = useState({});

    // normal pages (no sub)
    const mainPages = pages.filter(p => p.path && !p.sub);

    // group sub pages by sub name
    const groupedSubs = pages.reduce((acc, page) => {
        if (page.sub) {
            acc[page.sub] = acc[page.sub] || [];
            acc[page.sub].push(page);
        }
        return acc;
    }, {});

    const toggle = (key) => {
        setOpenSubs(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <aside className="sidebar">
            <h2 className="sidebar-title">Menu</h2>

            <ul className="sidebar-list">
                {/* main links */}
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

                {/* sub menus */}
                {Object.entries(groupedSubs).map(([group, items]) => {
                    const isOpen = openSubs[group];

                    return (
                        <li key={group} className="accordion">
                            <div
                                className="accordion-header"
                                onClick={() => toggle(group)}
                            >
                                <span>{group}</span>
                                <span className={`arrow ${isOpen ? "open" : ""}`}>
                                    &gt;
                                </span>
                            </div>

                            {isOpen && (
                                <ul className="accordion-content">
                                    {items.map(item => (
                                        <li key={item.path}>
                                            <NavLink
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "sidebar-link sub active"
                                                        : "sidebar-link sub"
                                                }
                                            >
                                                {item.title}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}


export function DashboardMenu({ pages }) {
    const [openSubs, setOpenSubs] = useState({});

    // normal links (no sub)
    const normalLinks = pages.filter(p => p.path && !p.sub);

    // group sub menus
    const subGroups = pages.reduce((acc, page) => {
        if (page.sub) {
            acc[page.sub] = acc[page.sub] || [];
            acc[page.sub].push(page);
        }
        return acc;
    }, {});

    const toggleSub = (group) => {
        setOpenSubs(prev => ({
            ...prev,
            [group]: !prev[group],
        }));
    };

    return (
        <nav>
            <ul>
                {/* normal menu items */}
                {normalLinks.map(page => (
                    <li key={page.path}>
                        <Link to={page.path}>{page.title}</Link>
                    </li>
                ))}

                {/* sub menus */}
                {Object.entries(subGroups).map(([group, items]) => {
                    const isOpen = openSubs[group];

                    return (
                        <li key={group}>
                            <span
                                style={{ cursor: "pointer", fontWeight: "bold" }}
                                onClick={() => toggleSub(group)}
                            >
                                {group} {isOpen ? ">" : ""}
                            </span>

                            {isOpen && (
                                <ul>
                                    {items.map(item => (
                                        <li key={item.path}>
                                            <Link to={item.path}>{item.title}</Link>
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
