import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardMenu({ pages }) {
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
