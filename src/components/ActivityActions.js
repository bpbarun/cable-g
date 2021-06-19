import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import moment from 'moment';
import MyUploader from './MyUploader';
import ThumbMedia from './ThumbMedia';
import { checkMyActivity, checkAdminUser, isAdmin, dateFormatSave, dateFormat, dateFormatEdit, checkTodayExceed, checkActivityValidation } from './ActivitiesGenericView';
import Header from './Header';

const classNames = require("classnames");
const notify = (msg) => toast(msg);

export default function ActivityActions(prop) {
    const apiUrl = localStorage.getItem('apiBaseUrl');

    const [ActionTime, setActionTime] = useState("");

    const [ActionTitle, setActionTitle] = useState(" ");

    const [ActivityId, setActivityId] = useState("");
    const [ActivityName, setActivityName] = useState(" ");
    const [ActivityDescription, setActivityDescription] = useState(" ");
    const [ActivityDeclineNote, setActivityDeclineNote] = useState(" ");
    const [ActivityPDept, setActivityPDept] = useState([]);
    const [ActivitySDept, setActivitySDept] = useState([]);
    const [ActivityStartDate, setActivityStartDate] = useState("01-Jan-1970");
    const [ActivityAlertDate, setActivityAlertDate] = useState("01-Jan-1970");
    const [ActivityEndDate, setActivityEndDate] = useState("01-Jan-1970");
    const [ActivityMediaNames, setActivityMediaNames] = useState([]);

    const [closeLabel, setCloseLabel] = useState("Close Activity");
    const [closeState, setCloseState] = useState("");
    const [closeMessage, setCloseMessage] = useState('We hope you have already uploaded the supported documents on google form. Please confirm if you want to close this activity.');

    const [readOnly, setReadOnly] = useState({ "": true });
    const [readOnlyDeclineNote, setreadOnlyDeclineNote] = useState("");

    let departments = prop.departments;
    let activityoperation = prop.activityoperation;
    let activity = prop.activity;
    if (ActionTime != prop.actiontime) {
        showingActivity(activity);
        setActionTime(prop.actiontime);
    }

    let departmentsArray = [];
    for (let i = 0; i < departments.length; i++) {
        let dropDownEle = {};
        dropDownEle['label'] = departments[i]['dept_name'];
        dropDownEle['value'] = departments[i]['dept_id'];
        departmentsArray[i] = dropDownEle;
    }

    function isActivityClosed() {
        return (activity.close_request == '2');
    }

    function isActionEdit() {
        return (activityoperation == "edit") ? true : false;
    }

    function isActionClose() {
        if (activity.close_request == '2') { return false; }
        switch (activityoperation) {
            case "close":
                return true;
            case "rfc":
                return true;
            case "edit":
                return checkTodayExceed(activity.alert_date);
            case "show":
                return checkTodayExceed(activity.alert_date) && checkMyActivity(activity.pdept_id);
            default:
                return false;
        }
    }

    function isActionDecline() {
        switch (activityoperation) {
            case "decline":
                return true;
            case "rfc":
                return true;
            case "edit":
                return (activity.close_request == '1');
            default:
                return false;
        }
    }

    function isActionDelete() {
        switch (activityoperation) {
            case "delete":
                return true;
            case "edit":
                return true;
            case "reactivate":
                return true;
            case "show":
                return checkAdminUser();
            default:
                return false;
        }
    }

    function isActionReactivate() {
        return (activityoperation == "reactivate") ? true : false;
    }

    function showingActivity(activity) {
        if (typeof (activity.act_id) == 'undefined') {
            return "";
        }
        switch (activityoperation) {
            case "edit":
                setActionTitle("Edit Activity");
                setReadOnly("");
                setreadOnlyDeclineNote("");
                break;
            case "close":
                setActionTitle("Closing Activity Detail");
                setReadOnly({ "": true });
                setreadOnlyDeclineNote({ "": true });
                break;
            case "decline":
                setActionTitle("Declining Activity Detail");
                setReadOnly({ "": true });
                setreadOnlyDeclineNote("");
                break;
            case "rfc":
                setActionTitle("RFC Activity Detail");
                setReadOnly({ "": true });
                setreadOnlyDeclineNote("");
                break;
            case "delete":
                setActionTitle("Deleting Activity Detail");
                setReadOnly({ "": true });
                setreadOnlyDeclineNote({ "": true });
                break;
            case "reactivate":
                setActionTitle("Closed Activity Detail");
                setReadOnly("");
                setreadOnlyDeclineNote("");
                break;
            default:
                setActionTitle("Activity Detail");
                setReadOnly({ "": true });
                setreadOnlyDeclineNote({ "": true });
        }
        setActivityId(activity.act_id);
        setActivityName(activity.act_name);
        setActivityDescription(activity.act_desc);
        setActivityDeclineNote(activity.decline_note);
        setActivityStartDate(dateFormatEdit(activity.start_date));
        setActivityAlertDate(dateFormatEdit(activity.alert_date));
        setActivityEndDate(dateFormatEdit(activity.end_date));

        $('#action_activity_start_date').val(dateFormatEdit(activity.start_date));
        $('#action_activity_alert_date').val(dateFormatEdit(activity.alert_date));
        $('#action_activity_end_date').val(dateFormatEdit(activity.end_date));

        axios.get(apiUrl + '/api/activity/assets/byactivity/' + activity.act_id, {
            headers: {
                'Token-Code': localStorage.getItem('token_code'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
            }
        })
            .then((response) => {
                if (response.data.status) {
                    setActivityMediaNames(response.data.data);
                }
                else {
                    setActivityMediaNames([])
                }
            })
            .catch(err => console.log('response catch', err));

        let selDept = [];
        selDept = activity.pdept_id.split(',');
        setActivityPDept(selDept);

        selDept = [];
        selDept = activity.sdept_id.split(',');
        setActivitySDept(selDept);

        if (isAdmin()) {
            if ((activity.show_to_all == 1 && document.getElementById("action_activity_show_to_all").checked != true) || (activity.show_to_all == 0 && document.getElementById("action_activity_show_to_all").checked != false)) {
                document.getElementById("action_activity_show_to_all").click();
            }
            if ((activity.allow_email == 1 && document.getElementById("action_activity_allow_email").checked != true) || (activity.allow_email == 0 && document.getElementById("action_activity_allow_email").checked != false)) {
                document.getElementById("action_activity_allow_email").click();
            }
        }

        if (isAdmin() && checkTodayExceed(activity.alert_date) && activity.close_request != "2") {
            let label = (activity.close_request == "1" ? "Confirm close" : "Close Activity");
            setCloseLabel(label)
            setCloseState("");
            setCloseMessage('Are you sure you want to close "' + activity.act_name + '" activity?');
        }
        else if (checkMyActivity(activity.pdept_id) && checkTodayExceed(activity.alert_date) && activity.close_request != "2") {
            let label = (activity.close_request == "1" ? "Requested for closure" : "Request for closure");
            let state = (activity.close_request == "1" ? { "": true } : "");
            setCloseLabel(label)
            setCloseState(state);
            setCloseMessage('We hope you have uploaded all the supporting documents for "' + activity.act_name + '" activity. Please confirm before submiting the request.');
        } else if (activity.close_request == "2") {
            setCloseState(!isAdmin() ? { "": true } : "");
        }
        clearNotification();
    }

    const editingActivity = (e) => {
        e.preventDefault();
        let act_id = document.getElementById('action_activity_id').value;
        let act_name = document.getElementById('action_activity_name').value;
        let act_desc = document.getElementById('action_activity_description').value;
        let start_date = dateFormatSave(document.getElementById('action_activity_start_date').value);
        let alert_date = dateFormatSave(document.getElementById('action_activity_alert_date').value);
        let end_date = dateFormatSave(document.getElementById('action_activity_end_date').value);
        let pdept_id = '0,' + ActivityPDept.join() + ',0';
        let sdept_id = '0,' + ActivitySDept.join() + ',0';
        let show_to_all = (document.getElementById("action_activity_show_to_all").checked) ? 1 : 0;
        let allow_email = (document.getElementById("action_activity_allow_email").checked) ? 1 : 0;

        let data = {
            act_name,
            act_desc,
            start_date,
            alert_date,
            end_date,
            pdept_id,
            sdept_id,
            show_to_all,
            allow_email,
        };

        if (checkActivityValidation(data) == false) { return false }

        if ((typeof (ActivityDeclineNote) == 'string') && ActivityDeclineNote.trim().length != 0) {
            data['decline_note'] = ActivityDeclineNote;
        }

        axios.post(apiUrl + '/api/activity/activity/update/' + act_id, data,
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            })
            .then((response) => {
                notify('Activity detail successfully updated.');
                prop.refreshData();
                document.getElementById('activity_actions_cancel').click();
            })
            .catch(err => console.log('response catch', err));
    }

    function closingActivity(e) {
        let act_id = document.getElementById('action_activity_id').value;
        let close_request = (checkAdminUser() ? '2' : '1');
        let data = { close_request };

        if (activity.close_request == '0') {
            data.close_submission_date = dateFormatSave(new Date().getDate());
        }
        if (close_request == '2') {
            data.decline_note = null;
        }

        axios.post(apiUrl + '/api/activity/activity/update/' + act_id, data,
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            }).then(function (response) {
                if (close_request == 2) {
                    notify('Activity closed.');
                }
                if (close_request == 1) {
                    notify('Activity close request sent.');
                }
                prop.refreshData();
                document.getElementById('activity_actions_cancel').click();
            })
            .catch(err => console.log('response catch', err));
    }

    function decliningActivity(e) {
        let act_id = document.getElementById('action_activity_id').value;;
        let close_request = '0';
        let close_submission_date = null;
        let decline_note = ActivityDeclineNote;

        if ((typeof (ActivityDeclineNote) == 'string') && ActivityDeclineNote.trim().length == 0) {
            notify('Decline note is mandatory.');
            return false;
        }

        let data = {
            close_request,
            close_submission_date,
            decline_note,
        }

        axios.post(apiUrl + '/api/activity/activity/update/' + act_id, data,
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            }).then(function (response) {
                notify('Decline activity successfully.');
                prop.refreshData();
                document.getElementById('activity_actions_cancel').click();
            })
            .catch(err => console.log('response catch', err));
    }

    const deletingActivity = (e) => {
        let act_id = document.getElementById('action_activity_id').value;;
        axios.post(apiUrl + '/api/activity/activity/delete/' + act_id, '',
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            })
            .then((response) => {
                notify('Activity deleted successfully.');
                prop.refreshData();
                document.getElementById('activity_actions_cancel').click();
            })
            .catch(err => console.log('response catch', err));
    }

    const reactivatingActivity = (e) => {
        e.preventDefault();
        let act_id = document.getElementById('action_activity_id').value;
        let act_name = document.getElementById('action_activity_name').value;
        let act_desc = document.getElementById('action_activity_description').value;
        let start_date = dateFormatSave(document.getElementById('action_activity_start_date').value);
        let alert_date = dateFormatSave(document.getElementById('action_activity_alert_date').value);
        let end_date = dateFormatSave(document.getElementById('action_activity_end_date').value);
        let pdept_id = '0,' + ActivityPDept.join() + ',0';
        let sdept_id = '0,' + ActivitySDept.join() + ',0';
        let show_to_all = (document.getElementById("action_activity_show_to_all").checked) ? 1 : 0;
        let allow_email = (document.getElementById("action_activity_allow_email").checked) ? 1 : 0;
        let close_request = 0;
        let re_activate_activity = 1;
        let close_submission_date = '0000-00-00 00:00:00';
        let close_date = '0000-00-00 00:00:00';

        let data = {
            act_name,
            act_desc,
            start_date,
            alert_date,
            end_date,
            pdept_id,
            sdept_id,
            show_to_all,
            allow_email,
            close_request,
            re_activate_activity,
            close_submission_date,
            close_date
        };

        axios.post(apiUrl + '/api/activity/activity/update/' + act_id, data,
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            })
            .then((response) => {
                notify('Activity re-activate successfully.');
                prop.refreshData();
            })
            .catch(err => console.log('response catch', err));
    }

    function clearNotification() {
        if (typeof (prop.clearNotification) === 'function') {
            prop.clearNotification();
        }
    }

    const inputEventActivityName = (event) => {
        setActivityName(event.target.value);
    }
    const inputEventActivityDescription = (event) => {
        setActivityDescription(event.target.value);
    }
    const inputEventActivityDeclineNote = (event) => {
        setActivityDeclineNote(event.target.value);
    }

    let selectChangePDept = (e) => {
        setActivityPDept(Array.isArray(e) ? e.map(x => x.value) : []);
    }
    let selectChangeSDept = (e) => {
        setActivitySDept(Array.isArray(e) ? e.map(x => x.value) : []);
    }

    $('.removeEnd').on('click', function () {
        $('#action_activity_end_date').val('');
    });
    $('.removeAlert').on('click', function () {
        $('#action_activity_alert_date').val('');
    });
    $('.removeStart').on('click', function () {
        $('#action_activity_start_date').val('');
    });

    return (
        <div>

            <div className="uk-width-medium-1-3">
                <div className="uk-modal" id="activity_actions">
                    <div className="uk-modal-dialog">
                        <div className="uk-modal-header">
                            <h3 className="uk-modal-title">{ActionTitle}</h3>
                        </div>

                        <div>
                            <div className="uk-width-medium-1-1">
                                <input type="hidden" name="action_activity_id" id="action_activity_id" value={ActivityId} />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">Activity Name</label>
                                <input type="text" className="input-count md-input" name="action_activity_name" id="action_activity_name" maxLength="255" autoComplete="off" value={ActivityName} onChange={inputEventActivityName} disabled={readOnly} />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <div className="parsley-row">
                                    <label htmlFor="message">Activity Description</label>
                                    <textarea className="input-count md-input" name="action_activity_description" id="action_activity_description" cols="10" rows="1" data-parsley-trigger="keyup" data-parsley-minlength="20" data-parsley-maxlength="1000" maxLength="1000" data-parsley-validation-threshold="10" value={ActivityDescription} onChange={inputEventActivityDescription} disabled={readOnly} ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-large-1-2">
                                <label className="required">Primary Department</label>
                                <Select classNamePrefix="select"
                                    className="basic-multi-select"
                                    value={departmentsArray.filter(obj => ActivityPDept.includes(obj.value))}
                                    options={departmentsArray}
                                    id='action_activity_pdept'
                                    isClearable
                                    name="action_activity_pdept"
                                    isMulti="true"
                                    isDisabled={readOnly}
                                    onChange={selectChangePDept} />
                            </div>
                            <div className="uk-width-large-1-2">
                                <label>Secondary Department</label>
                                <Select
                                    value={departmentsArray.filter(obj => ActivitySDept.includes(obj.value))}
                                    options={departmentsArray}
                                    placeholder=""
                                    id='action_activity_sdept'
                                    name="action_activity_sdept"
                                    isMulti="true"
                                    isDisabled={readOnly}
                                    onChange={selectChangeSDept} />
                            </div>
                        </div>
                        <div className="uk-grid uk-grid-small" data-uk-grid-margin>
                            <div className="uk-width-large-2-3 uk-width-1-1">
                                <div className="uk-input-group">
                                    <span className="uk-input-group-addon"><i className="uk-input-group-icon uk-icon-calendar"></i></span>
                                    <label>Activity Start Date</label>
                                    <input type="text" className="md-input" name="action_activity_start_date" id="action_activity_start_date" data-uk-datepicker="{format:'DD-MMM-YYYY'}" defaultValue={ActivityStartDate} autoComplete="off" selected={ActivityStartDate} disabled={readOnly} />
                                    <span className="uk-input-group-addon"><i className={classNames("md-icon material-icons removeStart cursor", { 'uk-hidden': !!readOnly })}>clear</i></span>
                                </div>
                            </div>
                            <div className="uk-width-large-2-3 uk-width-1-1 uk-margin">
                                <div className="uk-input-group">
                                    <span className="uk-input-group-addon"><i className="uk-input-group-icon uk-icon-calendar"></i></span>
                                    <label>Activity Alert Date</label>
                                    <input type="text" className="md-input" name="action_activity_alert_date" id="action_activity_alert_date" data-uk-datepicker="{format:'DD-MMM-YYYY'}" defaultValue={ActivityAlertDate} autoComplete="off" selected={ActivityAlertDate} disabled={readOnly} />
                                    <span className="uk-input-group-addon"><i className={classNames("md-icon material-icons removeAlert cursor", { 'uk-hidden': !!readOnly })}>clear</i></span>
                                </div>
                            </div>
                            <div className="uk-width-large-2-3 uk-width-1-1">
                                <div className="uk-input-group">
                                    <span className="uk-input-group-addon"><i className="uk-input-group-icon uk-icon-calendar"></i></span>
                                    <label>Activity End Date</label>
                                    <input type="text" className="md-input" name="action_activity_end_date" id="action_activity_end_date" data-uk-datepicker="{format:'DD-MMM-YYYY'}" defaultValue={ActivityEndDate} autoComplete="off" selected={ActivityEndDate} disabled={readOnly} />
                                    <span className="uk-input-group-addon"><i className={classNames("md-icon material-icons removeEnd cursor", { 'uk-hidden': !!readOnly })}>clear</i></span>
                                </div>
                            </div>
                        </div>
                        {isAdmin() &&
                            <div className={classNames("uk-grid", { 'uk-hidden': !isActionEdit() })} data-uk-grid-margin>
                                <div className="uk-width-medium-1-2">
                                    <input type="checkbox" data-switchery data-switchery-color="#236514" data-switchery-size="small" id="action_activity_show_to_all" />
                                    <label className="inline-label">Show to all</label>
                                </div>
                                <div className="uk-width-medium-1-2">
                                    <input type="checkbox" data-switchery data-switchery-color="#236514" data-switchery-size="small" id="action_activity_allow_email" />
                                    <label className="inline-label">e-mail Alert</label>
                                </div>
                            </div>
                        }
                        {((isActionClose() || isActivityClosed()) && (checkAdminUser() || checkMyActivity(ActivityPDept.join()))) &&
                            <div className="uk-grid" data-uk-grid-margin>
                                <div className="uk-width-medium-1-1">
                                    <label className="required">Attach Media</label>
                                    <div />
                                    {!(!!closeState) && !isActivityClosed() && <MyUploader act_id={ActivityId} setActivityMediaNames={setActivityMediaNames} />}
                                    <ThumbMedia act_id={ActivityId} setActivityMediaNames={setActivityMediaNames} mediaNames={ActivityMediaNames} closeState={closeState} />
                                </div>
                            </div>
                        }
                        {(isActionDecline() || ((checkAdminUser() || checkMyActivity(ActivityPDept.join())) && typeof (ActivityDeclineNote) == 'string' && ActivityDeclineNote.trim().length != 0)) &&
                            <div className="uk-grid" data-uk-grid-margin>
                                <div className="uk-width-medium-1-1">
                                    <div className="parsley-row">
                                        <label htmlFor="message">Decline Note</label>
                                        <textarea className="input-count md-input" name="action_activity_decline_note" id="action_activity_decline_note" cols="10" rows="1" data-parsley-trigger="keyup" data-parsley-minlength="20" data-parsley-maxlength="1000" maxLength="1000" data-parsley-validation-threshold="10" value={ActivityDeclineNote} onChange={inputEventActivityDeclineNote} disabled={readOnlyDeclineNote} ></textarea>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="uk-modal-footer uk-text-right">
                            {/* <span id="activity_actions_close_span"></span> */}
                            {isActionDelete() && <button type="button" className="md-btn md-btn-flat md-btn-flat-primary uk-align-left" id="activity_actions_delete" data-uk-modal="{target:'#activity_actions_delete_confirm_model'}">Delete</button>}
                            {isActionDecline() && <button type="button" className="md-btn md-btn-flat md-btn-flat-primary uk-align-left" id="activity_actions_decline" onClick={decliningActivity}>Decline</button>}
                            {isActionClose() && <input type="button" className={classNames("md-btn md-btn-flat md-btn-flat-primary", { 'disabled': !!closeState })} id="activity_actions_close" data-uk-modal="{target:'#activity_actions_close_confirm_model'}" value={closeLabel} disabled={closeState} />}
                            {isActionEdit() && <button type="button" className="md-btn md-btn-flat md-btn-flat-primary" id="activity_actions_update" onClick={editingActivity}>Update</button>}
                            {isActionReactivate() && <button type="button" className="md-btn md-btn-flat md-btn-flat-primary" id="activity_actions_reactivate" data-uk-modal="{target:'#activity_actions_reactivate_confirm_model'}">Re-Activate</button>}
                            <button type="button" className="md-btn md-btn-flat uk-modal-close" id="activity_actions_cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="uk-modal" id="activity_actions_close_confirm_model">
                <div className="uk-modal-dialog">
                    <p>{closeMessage}</p>
                    <div className="uk-modal-footer uk-text-right">
                        <button type="button" className="md-btn md-btn-flat uk-modal-close" onClick={closingActivity}>Yes</button>
                        <button className="md-btn md-btn-flat uk-modal-close">No</button>
                    </div>
                </div>
            </div>
            <div className="uk-modal" id="activity_actions_delete_confirm_model">
                <div className="uk-modal-dialog">
                    <p>{'Are you sure you want to close "' + ActivityName + '" activity?'}</p>
                    <div className="uk-modal-footer uk-text-right">
                        <button type="button" className="md-btn md-btn-flat uk-modal-close" onClick={deletingActivity}>Yes</button>
                        <button className="md-btn md-btn-flat uk-modal-close">No</button>
                    </div>
                </div>
            </div>
            <div className="uk-modal" id="activity_actions_reactivate_confirm_model">
                <div className="uk-modal-dialog">
                    <p>{'Are you sure you want to Re-Activate "' + ActivityName + '" activity?'}</p>
                    <div className="uk-modal-footer uk-text-right">
                        <button type="button" className="md-btn md-btn-flat uk-modal-close" onClick={reactivatingActivity}>Yes</button>
                        <button className="md-btn md-btn-flat uk-modal-close">No</button>
                    </div>
                </div>
            </div>

        </div>
    );
};
