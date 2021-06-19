import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { useParams, useHistory } from "react-router-dom";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import 'react-multiple-select-dropdown-lite/dist/index.css';
import AddActivity from './AddActivity';
import ActivityActions from './ActivityActions';
import ActivityExportExcel from './ActivityExportExcel';
import { ActivityCount } from './ActivitiesGenericView';
import { getPropertiesForActivityDT, checkMyActivity, checkAdminUser, dateFormat, checkTodayExceed } from './ActivitiesGenericView';
const classNames = require("classnames");
const notify = (msg) => toast(msg);

function isIAmInMyActivity(activity) {
    let dept_id = localStorage.getItem('dept_id');
    var arr_pdept_id = activity.pdept_id.split(',');
    var arr_sdept_id = activity.sdept_id.split(',');
    return arr_pdept_id.includes(dept_id) || arr_sdept_id.includes(dept_id);
}

function Alldepartment() {

    const apiUrl = localStorage.getItem('apiBaseUrl');
    const { id } = useParams();
    const history = useHistory();

    const [checkId, setcheckId] = useState('');

    const [departments, setDepartments] = useState([]);
    const [activeActivities, setActiveActivities] = useState([]);
    const [completedActivities, setCompletedActivities] = useState([]);
    const [countactivity, setCountActivity] = useState([]);
    const [refreshD, setRefreshD] = useState(new Date().getTime());

    const [activity, setActivity] = useState({});
    const [activityoperation, setActivityOperation] = useState("");
    const [actiontime, setActionTime] = useState(new Date().getTime());

    function fetchActivitiesCount() {
        axios.get(apiUrl + '/api/activity/activity/getAlertNotification/',
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
                    setCountActivity(response.data.data);
                }
            }).catch(err => console.log('response catch', err));
    };

    function fetchDepartments() {
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

    function fetchActiveActivities() {
        axios.get(apiUrl + '/api/activity/activity/AllActiveActivities/',
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            }).then(function (response) {
                $('#activeActivities').DataTable().destroy();
                if (!!response.data.status) {
                    setActiveActivities(response.data.data);
                }
                else {
                    setActiveActivities([]);
                }
                $('#activeActivities').DataTable(getPropertiesForActivityDT([3, 4]));
                $('.dataTables_filter input[type="search"]').css(
                    { 'width': '270px', 'display': 'inline-block' }
                );
            }).catch(err => console.log('response catch', err));
    };

    function fetchCompletedActivities() {
        axios.get(apiUrl + '/api/activity/activity/AllCompletedActivities/',
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            }).then(function (response) {
                $('#completedActivities').DataTable().destroy();
                if (!!response.data.status) {
                    setCompletedActivities(response.data.data);
                }
                else {
                    setCompletedActivities([]);
                }
                $('#completedActivities').DataTable(getPropertiesForActivityDT([3, 4, 5]));
                $('.dataTables_filter input[type="search"]').css(
                    { 'width': '270px', 'display': 'inline-block' }
                );
            }).catch(err => console.log('response catch', err));
    };

    function fetchData() {
        fetchActivitiesCount();
        fetchActiveActivities();
        fetchCompletedActivities();
    };

    useEffect(() => {
        fetchDepartments();
        fetchData();
        console.log("refresh time @ " + refreshD);
    }, [refreshD]);

    function refreshData() {
        setRefreshD(new Date().getTime());
    };

    function notiactivity() {
        axios.get(apiUrl + '/api/activity/activity/' + id,
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            }).then(function (response) {
                let activity = [];
                activity['activity'] = (!!response.data.status) ? response.data.data : [];

                if (checkAdminUser() && activity.activity.close_request != "2") {
                    editingActivity(activity)
                    $('#callActivityModelPopup').trigger('click');
                }
                else {
                    showingActivity(activity);
                    $('#callActivityModelPopup').trigger('click');
                }
            }).catch(err => console.log('response catch', err));
    };

    useEffect(() => {
        if (typeof (id) === 'undefined' || departments.length == 0) {
            return;
        }
        notiactivity();
    }, [checkId, departments]);

    useEffect(() => {
        if (typeof (id) !== 'undefined') {
            if (checkId != id) {
                setcheckId(id)
            }
        }
    }, [id]);

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

    function clearNotification() {
        history.push('/Alldepartment');
        setcheckId('');
    }

    const reactivatingActivity = (data) => {
        setActivity(data.activity);
        setActivityOperation("reactivate");
        setActionTime(new Date().getTime());
    }

    var sr = 1;
    var srn = 1;
    return (
        <div>
            <div id="page_content">
                <div id="page_content_inner">
                    <div>
                        <input type="hidden" id="refreshData" onClick={refreshData} />
                        <input type="hidden" data-uk-modal="{target:'#activity_actions'}" id="callActivityModelPopup" />
                    </div>

                    <h4 className="heading_a uk-margin-bottom">All Activities</h4>

                    {ActivityCount(countactivity)}

                    <div className="uk-grid" >
                        <div>
                            <ToastContainer />
                        </div>
                    </div>

                    <div className="uk-width-medium-1-12">
                        <div className="md-card">
                            <div className="md-card-content small-padding">
                                <ul className="uk-tab" data-uk-tab="{connect:'#tabs_anim1', animation:'scale'}">
                                    <li className="uk-active"><a href="#">Active</a></li>
                                    <li><a href="#">Completed</a></li>
                                    <div className="uk-vertical-align-middle uk-float-right">
                                        <ActivityExportExcel filename="All Activities" activeActivities={activeActivities} completedActivities={completedActivities} />
                                        {checkAdminUser() &&
                                            <span className="btnSectionClone cursor" data-uk-modal="{target:'#add_activity'}">
                                                <i className="material-icons md-36">add_box</i>
                                            </span>
                                        }
                                    </div>
                                </ul>
                                <ul id="tabs_anim1" className="uk-switcher uk-margin">
                                    {(typeof (activeActivities) !== 'undefined') ?
                                        <div className="md-card uk-margin-medium-bottom">
                                            <div className="md-card-content small-padding">
                                                <div className="uk-overflow-container">
                                                    <table id="activeActivities" className="uk-table uk-table-nowrap table_check">
                                                        <thead>
                                                            <tr>
                                                                <th className="uk-text-left width">S.No.</th>
                                                                <th className="uk-text-left uk-width-3-10">Activity Name</th>
                                                                <th className="uk-text-left uk-width-3-10">Primary Department</th>
                                                                <th className="uk-text-left width desktop">Start Date</th>
                                                                <th className="uk-text-left width">End Date</th>
                                                                <th className="uk-text-left width desktop">Request For Closure</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {activeActivities.map(activity => ((checkAdminUser() || (activity.show_to_all == '1') || isIAmInMyActivity(activity)) && (
                                                                <tr className={classNames({ 'bgred': checkTodayExceed(activity.alert_date) })} key={activity.act_id}>
                                                                    <td className="uk-text-left cell-vertical-middle">{sr++}</td>
                                                                    { checkAdminUser() ?
                                                                        <td className="uk-text-left cell-vertical-middle cell-wrap cursor" data-uk-modal="{target:'#activity_actions'}" onClick={() => editingActivity({ activity })}>{activity.act_name}</td>
                                                                        :
                                                                        <td className="uk-text-left cell-vertical-middle cell-wrap cursor" data-uk-modal="{target:'#activity_actions'}" onClick={() => showingActivity({ activity })}>{activity.act_name}</td>
                                                                    }
                                                                    <td className="uk-text-left cell-vertical-middle cell-wrap">{activity.pdept_name}</td>
                                                                    <td className="uk-text-left cell-vertical-middle desktop">{dateFormat(activity.start_date)}</td>
                                                                    <td className={classNames("uk-text-left cell-vertical-middle", { 'blinking': checkTodayExceed(activity.alert_date) })}>{dateFormat(activity.end_date)}</td>
                                                                    <td className="uk-text-left cell-vertical-middle table-cell-height desktop" style={{ height: '23px' }}>
                                                                        {checkTodayExceed(activity.alert_date) ?
                                                                            {
                                                                                '0': (checkMyActivity(activity.pdept_id) || checkAdminUser()) ? <button className="md-btn" data-uk-modal="{target:'#activity_actions'}" onClick={() => closingActivity({ activity })}>Close</button> : '-',
                                                                                '1': checkAdminUser() ? <button className="md-btn" data-uk-modal="{target:'#activity_actions'}" onClick={() => rfcActivity({ activity })}>RFC</button> : 'Requested for closure',
                                                                                '2': 'Closed',
                                                                            }[activity.close_request]
                                                                            :
                                                                            '-'
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        : <div className="uk-text-center">No Record Found</div>}
                                    {(typeof (completedActivities) !== 'undefined') ?
                                        <div className="md-card uk-margin-medium-bottom">
                                            <div className="md-card-content small-padding">
                                                <div className="uk-overflow-container">
                                                    <table id="completedActivities" className="uk-table uk-table-nowrap table_check">
                                                        <thead>
                                                            <tr>
                                                                <th className="uk-text-left width">S.No.</th>
                                                                <th className="uk-text-left uk-width-3-10">Activity Name</th>
                                                                <th className="uk-text-left uk-width-3-10">Primary Department</th>
                                                                <th className="uk-text-left width desktop">Start Date</th>
                                                                <th className="uk-text-left width">End Date</th>
                                                                <th className="uk-text-left width desktop">Submission Date</th>
                                                                <th className="uk-text-left width desktop">Overdue By</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {completedActivities.map((activity, index) => (
                                                                <tr key={activity.act_id}>
                                                                    <td className="uk-text-left cell-vertical-middle">{srn++}</td>
                                                                    { checkAdminUser() ?
                                                                        <td className="uk-text-left cell-vertical-middle cell-wrap cursor" data-uk-modal="{target:'#activity_actions'}" onClick={() => reactivatingActivity({ activity })}>{activity.act_name}</td>
                                                                        :
                                                                        <td className="uk-text-left cell-vertical-middle cell-wrap cursor" data-uk-modal="{target:'#activity_actions'}" onClick={() => showingActivity({ activity })}>{activity.act_name}</td>
                                                                    }
                                                                    <td className="uk-text-left cell-vertical-middle cell-wrap">{activity.pdept_name}</td>
                                                                    <td className="uk-text-left cell-vertical-middle desktop">{dateFormat(activity.start_date)}</td>
                                                                    <td className="uk-text-left cell-vertical-middle">{dateFormat(activity.end_date)}</td>
                                                                    <td className="uk-text-left cell-vertical-middle desktop">{dateFormat(activity.close_submission_date)}</td>
                                                                    <td className="uk-text-left cell-vertical-middle desktop">{(moment(activity.close_submission_date).from(moment(activity.end_date))).replace('in ', '').replace(/(.+)ago/, 'On Time')}</td>
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
            <AddActivity refreshData={refreshData} departments={departments} />
            <ActivityActions refreshData={refreshData} departments={departments} actiontime={actiontime} activity={activity} activityoperation={activityoperation} clearNotification={clearNotification} />
        </div>
    );
}

export default Alldepartment;
