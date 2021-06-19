import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink
} from "react-router-dom";

import { checkAdminUser } from './ActivitiesGenericView';

function changeBackground(e) {
    e.target.style.hover = 'red';
}

function Sidebar() {
    return (
        <div>
            <aside id="sidebar_main">

                <div className="sidebar_main_header">
                    <div className="sidebar_logo">
                        <NavLink to="/" className="sSidebar_hide sidebar_logo_large">
                            <img className="logo_regular" src="/assets/img/logo1.png" alt="" height="150" width="150" />
                        </NavLink>
                        <NavLink to="/" className="sSidebar_show sidebar_logo_small">
                            <img className="logo_regular" src="/assets/img/logo_main_small.png" alt="" height="32" width="32" />
                            <img className="logo_light" src="/assets/img/logo_main_small_light.png" alt="" height="32" width="32" />
                        </NavLink>
                    </div>
                </div>

                <div className="menu_section" style={{ marginLeft: "24px" }}>
                    <ul>
                        {checkAdminUser() && <a href="javascript:void(0)">
                            <NavLink to="/Dashboard">
                                <li title="Dashboard">
                                    <span className="menu_icon"><img className="side" src="/assets/img/Dashboard.png" height="59" width="59" /></span>
                                    <span className="menu_title">Dashboard</span>
                                </li>
                            </NavLink>
                        </a>}
                        <a href="javascript:void(0)">
                            <NavLink to="/Order">
                                <li title="Order">
                                    <span className="menu_icon"><img className="side" src="/assets/img/Rfc.png" height="59" width="59" /></span>
                                    <span className="menu_title">Order</span>
                                </li>
                            </NavLink>
                        </a>
                        <a href="javascript:void(0)">
                            <NavLink to="/Coustomer">
                                <li title="Coustomer">
                                    <span className="menu_icon"><img className="side" src="/assets/img/MyActivity.png" height="59" width="59" /></span>
                                    <span className="menu_title">Coustomer</span>
                                </li>
                            </NavLink>
                        </a>
                        {checkAdminUser() && <a href="javascript:void(0)">
                            <NavLink to="/importactivity">
                                <li title="Import Activities">
                                    <span className="menu_icon"><img className="side" src="/assets/img/ImportActivity.png" height="59" width="59" /></span>
                                    <span className="menu_title">Import Activities</span>
                                </li>
                            </NavLink>
                        </a>}
                        {checkAdminUser() && <a href="javascript:void(0)">
                            <NavLink to="/Department">
                                <li title="Departments">
                                    <span className="menu_icon"><img className="side" src="/assets/img/Department.png" height="59" width="59" /></span>
                                    <span className="menu_title">Departments</span>
                                </li>
                            </NavLink>
                        </a>}
                        {checkAdminUser() && <a href="javascript:void(0)">
                            <NavLink to="/User">
                                <li title="Users">
                                    <span className="menu_icon"><img className="side" src="/assets/img/User.png" height="59" width="59" /></span>
                                    <span className="menu_title">Users</span>
                                </li>
                            </NavLink>
                        </a>}
                    </ul>
                </div>

            </aside>
        </div>
    );
}

export default Sidebar;
