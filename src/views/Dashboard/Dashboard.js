import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Menu from '../../components/Menu/Menu';
import Favorite from '../Favorite/Favorite';
import Search from '../Search/Search';
import Upload from '../Upload/Upload';

import './Dashboard.css';

const Dashboard = () => {
    return (
        <Router>
            <div className="dashboard">
                <Menu />
                <Switch>
                    <Route path="/upload">
                        <Upload />
                    </Route>
                    <Route path="/favorite">
                        <Favorite />
                    </Route>
                    <Route path="/">
                        <Search />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default Dashboard;