// src/sitemap/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ pages }) {
    return (
        <aside className="sidebar">
            <h2 className="sidebar-title">Menu</h2>
            <ul className="sidebar-list">
                {pages.map((page) => (
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
            </ul>
        </aside>
    );
}

export default Sidebar;
