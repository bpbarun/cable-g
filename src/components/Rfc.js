import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-multiple-select-dropdown-lite/dist/index.css';
import moment from 'moment';
import ActivityActions from './ActivityActions';
import { getPropertiesForActivityDT, dateFormat, checkTodayExceed } from './ActivitiesGenericView';
const classNames = require("classnames");
const notify = (msg) => toast(msg);

function Rfc() {
    const apiUrl = localStorage.getItem('apiBaseUrl');

    const [departments, setDepartments] = useState([]);
    const [rfcActivities, setRfcActivities] = useState([""]);
    const [refreshD, setRefreshD] = useState(new Date().getTime());

    const [activity, setActivity] = useState({});
    const [activityoperation, setActivityOperation] = useState("");
    const [actiontime, setActionTime] = useState(new Date().getTime());

    function fetchData() {
        axios.get(apiUrl + '/api/activity/activity/rfc/',
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            }).then(function (response) {
                $('#rfcActivities').DataTable().destroy();
                if (!!response.data.status) {
                    setRfcActivities(response.data.data);
                }
                else {
                    setRfcActivities([]);
                }
                $('#rfcActivities').DataTable(getPropertiesForActivityDT([3, 4]));
                $('.dataTables_filter input[type="search"]').css(
                    { 'width': '270px', 'display': 'inline-block' }
                );
            }).catch(err => console.log('response catch', err));

        axios.get(apiUrl + '/api/department/department/',
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            }).then(function (response) {
                if (!!response.data.status) {
                    setDepartments(response.data.data);
                }
            }).catch(err => console.log('response catch', err));
    };

    useEffect(() => {
        fetchData();
        console.log("refresh time @ " + refreshD);
    }, [refreshD]);

    function refreshData() {
        setRefreshD(new Date().getTime());
    };

    function showingActivity(data) {
        setActivity(data.activity);
        setActivityOperation("show");
        setActionTime(new Date().getTime());
    }

    function editingActivity(data) {
        setActivity(data.activity);
        setActivityOperation("edit");
        setActionTime(new Date().getTime());
    }

    function closingActivity(data) {
        setActivity(data.activity);
        setActivityOperation("close");
        setActionTime(new Date().getTime());
    }

    const declingActivity = (data) => {
        setActivity(data.activity);
        setActivityOperation("decline");
        setActionTime(new Date().getTime());
    }

    const rfcActivity = (data) => {
        setActivity(data.activity);
        setActivityOperation("rfc");
        setActionTime(new Date().getTime());
    }

    const deletingActivity = (data) => {
        setActivity(data.activity);
        setActivityOperation("delete");
        setActionTime(new Date().getTime());
    }

    var sr = 1;
    return (
        <div>
            <div id="page_content">
                <div id="page_content_inner">
                    <div>
                        <input type="hidden" id="refreshData" onClick={refreshData} />
                    </div>

                    <h4 className="heading_a uk-margin-bottom">RFC Dashboard</h4>

                    <div className="uk-grid" >
                        <div>
                            <ToastContainer />
                        </div>
                    </div>

                    <div className="uk-width-medium-1-12">
                        <div className="md-card">
                            <div className="md-card-content small-padding">
                                <ul data-uk-tab="{connect:'#tabs_anim1', animation:'scale'}">
                                </ul>
                                <ul id="tabs_anim1" className="uk-switcher uk-margin">
                                    {(typeof (rfcActivities) !== 'undefined') ?
                                        <div className="md-card uk-margin-medium-bottom">
                                            <div className="md-card-content small-padding">
                                                <div className="uk-overflow-container">
                                                    <table id="rfcActivities" className="uk-table uk-table-nowrap table_check">
                                                        <thead>
                                                            <tr>
                                                                <th className="uk-text-left width">S.No.</th>
                                                                <th className="uk-text-left uk-width-3-10">Activity name</th>
                                                                <th className="uk-text-left uk-width-3-10">Primary Department</th>
                                                                <th className="uk-text-left width">End Date</th>
                                                                <th className="uk-text-left width">Submission Date</th>
                                                                <th className="uk-text-left width desktop">Overdue By</th>
                                                                <th className="uk-text-left width">Request For Closure</th>
                                                                <th className="uk-text-left width">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {rfcActivities.map(activity => (
                                                                <tr className={classNames({ 'bgred': checkTodayExceed(activity.alert_date) })} key={activity.act_id}>
                                                                    <td className="uk-text-left cell-vertical-middle">{sr++}</td>
                                                                    <td className="uk-text-left cell-vertical-middle cell-wrap">{activity.act_name}</td>
                                                                    <td className="uk-text-left cell-vertical-middle cell-wrap">{activity.pdept_name}</td>
                                                                    <td className={classNames("uk-text-left cell-vertical-middle", { 'blinking': checkTodayExceed(activity.alert_date) })}>{dateFormat(activity.end_date)}</td>
                                                                    <td className="uk-text-left cell-vertical-middle">{dateFormat(activity.close_submission_date)}</td>
                                                                    <td className="uk-text-left cell-vertical-middle desktop">{(moment(activity.close_submission_date).from(moment(activity.end_date))).replace('in ', '').replace(/(.+)ago/, 'On Time')}</td>
                                                                    <td className="uk-text-left cell-vertical-middle"><button className="md-btn" data-uk-modal="{target:'#activity_actions'}" onClick={() => rfcActivity({ activity })}>RFC</button></td>
                                                                    <td>
                                                                        <div className="md-card-list-wrapper">
                                                                            <div className="uk-container-center">
                                                                                <div className="md-card-list">
                                                                                    <div className="md-card-list-item-menu" data-uk-dropdown="{mode:'click',pos:'bottom-right'}">
                                                                                        <a href="#" className="md-icon material-icons">&#xE5D4;</a>
                                                                                        <div className="uk-dropdown uk-dropdown-small">
                                                                                            <ul className="uk-nav">
                                                                                                <li><a href="#" data-uk-modal="{target:'#activity_actions'}" onClick={() => declingActivity({ activity })}><i className="material-icons">&#xE149;</i>Decline</a></li>
                                                                                                <li><a href="#" data-uk-modal="{target:'#activity_actions'}" onClick={() => closingActivity({ activity })}><i className="material-icons">&#xE5CD;</i>Close</a></li>
                                                                                                <li><a href="#" data-uk-modal="{target:'#activity_actions'}" onClick={() => deletingActivity({ activity })}> <i className="material-icons">&#xE872;</i>Delete</a></li>
                                                                                                <li><a href="#" data-uk-modal="{target:'#activity_actions'}" onClick={() => editingActivity({ activity })}> <i className="material-icons">&#xE254;</i>Edit</a></li>
                                                                                            </ul>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        : <div className="uk-text-center">No Record Found</div>}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ActivityActions refreshData={refreshData} departments={departments} actiontime={actiontime} activity={activity} activityoperation={activityoperation} />
        </div>
    );
}

export default Rfc;
