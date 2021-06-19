import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import firebase from 'firebase';
import { NavLink } from "react-router-dom";

function logout() {
    const apiUrl = localStorage.getItem('apiBaseUrl');
    if (localStorage.getItem('notification_id') !== null) {
        $.ajax({
            url: apiUrl + '/api/notification/notification/' + localStorage.getItem('notification_id'),
            method: 'DELETE',
            headers: { 'Token-Code': localStorage.getItem('token_code') },
            async: false,
            beforeSend: function () {
            }, complete: function () {
            }, success: function (responseData) {
                if (responseData.status) {
                    localStorage.removeItem('notification_id')
                    console.log('Logout success');
                } else {
                    console.log('error in Logout');
                }
            }, error: function () {
                console.log('inside error');

            }
        });
    }
    localStorage.removeItem('token_code')
    localStorage.removeItem('token_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('dept_id');
    localStorage.removeItem('dashboarddepartmentName');
    localStorage.removeItem('dashboarddepartmentId');
    localStorage.removeItem('id');
    window.location = "/login";
}

function allowNotification() {
    console.log('Allow Notification pushed.')
}

function Header() {
    const apiUrl = localStorage.getItem('apiBaseUrl');
    const [notification, setNotification] = useState([""]);
    useEffect(() => {
        axios.get(apiUrl + '/api/notification/sendNotification/' + localStorage.getItem('dept_id'),
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            }).then(function (response) {
                if (typeof (response.data.data) != 'undefined') {
                    setNotification(response.data.data);
                }
            });
    }, []);
    return (
        <div>
            <header id="header_main">
                <div className="header_main_content">
                    <nav className="uk-navbar">
                        <a href="#" id="sidebar_main_toggle" className="sSwitch sSwitch_left">
                            <span className="sSwitchIcon"></span>
                        </a>
                        <a href="#" id="sidebar_secondary_toggle" className="sSwitch sSwitch_right sidebar_secondary_check">
                            <span className="sSwitchIcon"></span>
                        </a>
                        <div className="uk-navbar-flip">
                            <ul className="uk-navbar-nav user_actions">
                                <li><a href="#" id="full_screen_toggle" className="user_action_icon uk-visible-large"><i className="material-icons md-24 md-light">fullscreen</i></a></li>
                                <li data-uk-dropdown="{mode:'click',pos:'bottom-right'}"><a href="#" className="user_action_icon"><i className="material-icons md-24 md-light">&#xE7F4;</i>
                                </a>
                                    <div className="uk-dropdown uk-dropdown-xlarge">
                                        <div className="md-card-content">
                                            <ul className="uk-tab uk-tab-grid" data-uk-tab="{connect:'#header_alerts',animation:'slide-horizontal'}">
                                                <li className="uk-width uk-active"><a href="#" className="js-uk-prevent uk-text-small">Notification</a></li>
                                            </ul>
                                            <ul id="header_alerts" className="uk-switcher uk-margin">
                                                {notification.map(notifyname => (
                                                    <li>
                                                        <ul className="md-list md-list-addon">
                                                            <li>
                                                                <div className="md-list-addon-element" style={{ padding: "2" }}>
                                                                    <span className="md-user-letters md-bg-cyan">{notifyname.dept_name && notifyname.dept_name.substr(0, 1)}{notifyname.act_id}</span>
                                                                </div>
                                                                <div className="md-list-content">
                                                                    <span className="md-list-heading"><NavLink to={'/Alldepartment/' + notifyname.act_id}>
                                                                        {notifyname.dept_name}</NavLink></span>
                                                                    <span className="uk-text-small uk-text-muted">{notifyname.message}</span>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li data-uk-dropdown="{mode:'click',pos:'bottom-right'}">
                                    <a href="#" id="admin" className="user_action_image uplerLetter">{localStorage.getItem('user_name')}</a>
                                    <div className="uk-dropdown uk-dropdown-small">
                                        <ul className="uk-nav js-uk-prevent">
                                            <li><a href="javascript:void(0)" onClick={logout}>Logout</a></li>
                                            <li><a href="javascript:void(0)" onClick={allowNotification} >Allow Notification</a></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <div className="header_main_search_form">
                    <i className="md-icon header_main_search_close material-icons">&#xE5CD;</i>
                    <form className="uk-form uk-autocomplete" data-uk-autocomplete="{source:'data/search_data.json'}">
                        <input type="text" className="header_main_search_input" />
                        <button className="header_main_search_btn uk-button-link"><i className="md-icon material-icons">&#xE8B6;</i></button>
                        <script type="text/autocomplete">
                            <ul className="uk-nav uk-nav-autocomplete uk-autocomplete-results">
                                <li data-value="">
                                    <a href="" className="needsclick">
                                        <br>
                                        </br>
                                        <span className="uk-text-muted uk-text-small"></span>
                                    </a>
                                </li>
                            </ul>
                        </script>
                    </form>
                </div>
            </header>
        </div>
    );
}

export default Header;
