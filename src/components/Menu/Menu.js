import React from 'react';
import { Link } from "react-router-dom";

import './Menu.css';

const Menu = () => {
    return (
        <div className="menu">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/favorite">Vos Favoris</Link>
                </li>
                <li>
                    <Link to="/upload">Upload</Link>
                </li>
            </ul>
        </div>
    );
}

export default Menu;