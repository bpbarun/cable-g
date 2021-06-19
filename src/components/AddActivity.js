import React, { useState } from 'react';
import 'react-multiple-select-dropdown-lite/dist/index.css';
import Select from "react-select";
import axios from 'axios';
import $ from 'jquery';
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { ToastContainer, toast } from 'react-toastify';
import { dateFormatSave } from './ActivitiesGenericView';
const notify = (msg) => toast(msg);

const AddActivity = (prop) => {
    const apiUrl = localStorage.getItem('apiBaseUrl');

    let [primarySelect, setPrimarySelect] = useState([]);
    let [secoundrySelect, setSecoundrySelect] = useState([]);

    let primarySelectChange = (e) => {
        setPrimarySelect(Array.isArray(e) ? e.map(x => x.value) : []);
    }
    let secondrySelectChange = (e) => {
        setSecoundrySelect(Array.isArray(e) ? e.map(x => x.value) : []);
    }

    const addingActivity = (e) => {
        e.preventDefault();
        let act_name = document.getElementById('add_activity_name').value;
        let act_desc = document.getElementById('add_activity_description').value;
        let start_date = dateFormatSave(document.getElementById('add_activity_start_date').value);
        let alert_date = dateFormatSave(document.getElementById('add_activity_alert_date').value);
        let end_date = dateFormatSave(document.getElementById('add_activity_end_date').value);
        let pdept_id = '0,' + primarySelect.join() + ',0';
        let sdept_id = '0,' + secoundrySelect.join() + ',0';
        let show_to_all = (document.getElementById("add_activity_show_to_all").checked) ? 1 : 0;
        let allow_email = (document.getElementById("add_activity_allow_email").checked) ? 1 : 0;

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

        if ((act_name == '') || (pdept_id == "0,,0")) {
            notify('Fields marked with * are mandatory.');
            return false;
        }
        notify('Saving new activity ...');
        $('#saveBtn').addClass('disabled');
        axios.post(apiUrl + '/api/activity/activity/', data, {
            headers: {
                'Token-Code': localStorage.getItem('token_code'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
            }
        })
            .then((response) => {
                notify('New activity successfully added.');
                prop.refreshData();
                document.getElementById('close_add_activity').click();
            })
            .catch(err => console.log('response catch', err));
        setTimeout(function () {
            $('#saveBtn').removeClass('disabled');
        }, 2000);
    }

    const clearText = () => {
        document.getElementById('add_activity_name').value = "";
        document.getElementById('add_activity_name').value = "";
        document.getElementById('add_activity_description').value = "";
        document.getElementById('add_activity_start_date').value = "";
        document.getElementById('add_activity_alert_date').value = "";
        document.getElementById('add_activity_end_date').value = "";
        document.getElementsByName('add_activity_pdept')[0].value = "";
        document.getElementsByName('add_activity_sdept')[0].value = "";
    }

    let departments = prop.departments;
    let departmentsArray = [];
    for (let i = 0; i < departments.length; i++) {
        let dropDownEle = {};
        dropDownEle['label'] = departments[i]['dept_name'];
        dropDownEle['value'] = departments[i]['dept_id'];
        departmentsArray[i] = dropDownEle;
    }

    $('.removeEnd').on('click', function () {
        $('#add_activity_end_date').val('');
    });
    $('.removeAlert').on('click', function () {
        $('#add_activity_alert_date').val('');
    });
    $('.removeStart').on('click', function () {
        $('#add_activity_start_date').val('');
    });

    return (
        <div>
            <div className="uk-width-medium-1-3">
                <div className="uk-modal" id="add_activity">
                    <div className="uk-modal-dialog">
                        <div className="uk-modal-header">
                            <h3 className="uk-modal-title">Add Activity</h3>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">Activity Name</label>
                                <input type="text" className="input-count md-input" name="add_activity_name" id="add_activity_name" maxLength="255" autoComplete="off" />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <div className="parsley-row">
                                    <label htmlFor="message">Activity Description</label>
                                    <textarea className="input-count md-input" name="add_activity_description" id="add_activity_description" cols="10" rows="1" data-parsley-trigger="keyup" data-parsley-minlength="20" data-parsley-maxlength="1000" maxLength="1000" data-parsley-validation-threshold="10" ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-large-1-2">
                                <label className="required">Primary Department</label>
                                <Select classNamePrefix="select" className="basic-multi-select" options={departmentsArray} placeholder="" id='add_activity_pdept' name="add_activity_pdept" isMulti="true" onChange={primarySelectChange} />
                            </div>
                            <div className="uk-width-large-1-2">
                                <label>Secondary Department</label>
                                <Select options={departmentsArray} placeholder="" id='add_activity_sdept' name="add_activity_sdept" isMulti="true" onChange={secondrySelectChange} />
                            </div>
                        </div>
                        <div className="uk-grid uk-grid-small uk-margin" data-uk-grid-margin>
                            <div className="uk-width-large-2-3 uk-width-1-1">
                                <div className="uk-input-group">
                                    <span className="uk-input-group-addon"><i className="uk-input-group-icon uk-icon-calendar"></i></span>
                                    <label>Activity Start Date</label>
                                    <input className="md-input" name="add_activity_start_date" id="add_activity_start_date" data-uk-datepicker="{format:'DD-MMM-YYYY'}" autoComplete="off" readOnly />
                                    <span className="uk-input-group-addon"><i className="material-icons removeStart cursor">clear</i></span>
                                </div>
                            </div>
                            <div className="uk-width-large-2-3 uk-width-1-1 uk-margin">
                                <div className="uk-input-group">
                                    <span className="uk-input-group-addon"><i className="uk-input-group-icon uk-icon-calendar"></i></span>
                                    <label>Activity Alert Date</label>
                                    <input className="md-input" name="add_activity_alert_date" id="add_activity_alert_date" data-uk-datepicker="{format:'DD-MMM-YYYY'}" autoComplete="off" readOnly />
                                    <span className="uk-input-group-addon"><i className="material-icons removeAlert cursor">clear</i></span>
                                </div>
                            </div>
                            <div className="uk-width-large-2-3 uk-width-1-1">
                                <div className="uk-input-group">
                                    <span className="uk-input-group-addon"><i className="uk-input-group-icon uk-icon-calendar"></i></span>
                                    <label>Activity End Date</label>
                                    <input className="md-input" name="add_activity_end_date" id="add_activity_end_date" data-uk-datepicker="{format:'DD-MMM-YYYY'}" autoComplete="off" readOnly />
                                    <span className="uk-input-group-addon"><i className="material-icons removeEnd cursor">clear</i></span>
                                </div>
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-2">
                                <input type="checkbox" data-switchery data-switchery-color="#236514" data-switchery-size="small" id="add_activity_show_to_all" defaultChecked="1" />
                                <label className="inline-label">Show to all</label>
                            </div>
                            <div className="uk-width-medium-1-2">
                                <input type="checkbox" data-switchery data-switchery-color="#236514" data-switchery-size="small" id="add_activity_allow_email" defaultChecked="1" />
                                <label className="inline-label">e-mail Alert</label>
                            </div>
                        </div>

                        <div className="uk-modal-footer uk-text-right">
                            <input type="button" id="saveBtn" className="md-btn md-btn-flat md-btn-flat-primary" value="Save" onClick={addingActivity} />
                            <button type="button" id="close_add_activity" className="md-btn md-btn-flat uk-modal-close" onClick={clearText}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default AddActivity;
