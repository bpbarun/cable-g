import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPropertiesForActivityDT } from './ActivitiesGenericView';

function Department() {
    const apiUrl = localStorage.getItem('apiBaseUrl');

    const [deptId, setDeptId] = useState("");
    const [deptName, setDeptName] = useState(" ");
    const [deptDesc, setDeptDesc] = useState(" ");
    const [hodId, setHodId] = useState("0");
    const [delete_id, setDelete_Id] = useState('');
    const [usertable, setUserTable] = useState([]);
    const [table, setTable] = useState([]);

    const fetchData = () => {
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
                $('#dt_tableExport').DataTable().destroy();
                if (response.data.status) {
                    setTable(response.data.data);
                } else {
                    setTable([]);
                }
                $('#dt_tableExport').DataTable(getPropertiesForActivityDT());
                $('.dataTables_filter input[type="search"]').css(
                    { 'width': '270px', 'display': 'inline-block' }
                );
            });
    }

    useEffect((e) => {
        axios.get(apiUrl + '/api/user/user/',
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            }).then(function (response) {
                const UserData = response.data.data;
                if (response.data.status) {
                    setUserTable(response.data.data);
                }
            });
    }, []);

    const clickAddDept = () => {
        setDeptId("");
        setDeptName("");
        setDeptDesc("");
        setHodId(0);
    }

    const clickEditDept = (e) => {
        setDeptId(e.table.dept_id);
        setDeptName(e.table.dept_name);
        setDeptDesc(e.table.dept_desc);
        setHodId(e.table.hod_id);
    }

    useEffect(() => {
        fetchData();
    }, []);

    var sr = 1;
    const inputDeptName = (event) => {
        setDeptName(event.target.value);
    };
    const inputDeptDesc = (event) => {
        setDeptDesc(event.target.value);
    };
    const inputHodId = (event) => {
        setHodId(event.target.value);
    };

    const clickSaveDept = (e) => {
        document.getElementById('savedept').disabled = true;
        e.preventDefault();
        let dept_name = deptName;
        let dept_desc = deptDesc;
        let hod_id = hodId;
        if (dept_name == '') {
            notify('Fields marked with * are mandatory.');
            document.getElementById('savedept').disabled = false;
            return false;
        }

        let data = {
            dept_name,
            dept_desc,
            hod_id
        };
        axios.post(apiUrl + '/api/department/department/', data, {
            headers: {
                'Token-Code': localStorage.getItem('token_code'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
            }
        })
            .then((response) => {
                notify('New department successfully added.');
                $('.Toastify__toast').css('bgcolor', 'red');
                document.getElementById('modal_add_activity').click();
                console.log(response);
                fetchData();
            })
            .catch(err =>
                console.log('getting error', err)
            );
        setTimeout(function () {
            document.getElementById("savedept").disabled = false;
        }, 2000);
    };

    const setDeleteId = (data) => {
        setDelete_Id(data.table.dept_id);
    }



    const deleteuser = (id) => {
        axios.post(apiUrl + '/api/department/department/delete/' + id, '', {
            headers: {
                'Token-Code': localStorage.getItem('token_code'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
            }
        })
            .then((response) => {
                notify('Department successfully deleted.');
                fetchData();
            })
            .catch(err =>
                console.log('getting error', err)
            );
    }

    const notify = (msg) => toast(msg);


    const clickUpdateDept = () => {
        document.getElementById("update_dept").disabled = true;
        let id = deptId;
        let dept_name = deptName;
        let dept_desc = deptDesc;
        let hod_id = hodId;

        if (dept_name == '') {
            notify('Please enter department name.');
            document.getElementById("update_dept").disabled = false;
            return false;
        }
        let data = {
            dept_name,
            dept_desc,
            hod_id
        };

        axios.post(apiUrl + '/api/department/department/update/' + id, data, {
            headers: {
                'Token-Code': localStorage.getItem('token_code'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
            }
        })
            .then((response) => {
                notify('Department details successfully updated.');
                console.log(response);
                document.getElementById('model_update').click();
                fetchData();
            })
            .catch(err =>
                console.log('getting error', err)
            );
        setTimeout(function () {
            document.getElementById("update_dept").disabled = false;
        }, 2000);
    }

    return (
        <div>
            <div id="page_content">
                <div id="page_content_inner">
                    <div className="">
                        <ToastContainer />
                    </div>
                    <h4 className="heading_a uk-margin-bottom">Department Management</h4>
                    <div className="uk-grid" >
                        <div className="uk-width-medium-1-12">
                            <div className="md-card" data-uk-grid-margin>
                                <div className="md-card-content small-padding">
                                    <ul className="uk-tab" data-uk-tab="{connect:'#tabs_anim1', animation:'scale'}">
                                        <div className="uk-vertical-align-middle" style={{ float: 'right' }} data-uk-modal="{target:'#add_department'}" onClick={() => clickAddDept()}>
                                            <a href="#" className="btnSectionClone"><i className="material-icons md-36"></i></a>
                                        </div>
                                    </ul>
                                    <ul id="tabs_anim1" className="uk-switcher uk-margin">
                                        <div className="md-card uk-margin-medium-bottom">
                                            <div className="md-card-content small-padding">
                                                <div className="uk-overflow-container">
                                                    <table id="dt_tableExport" className="uk-table uk-table-nowrap table_check">
                                                        <thead>
                                                            <tr>
                                                                <th className="uk-width-1-10 uk-text-left" id="dep_snum">S.No.</th>
                                                                <th className="uk-width-2-10 uk-text-left">Name</th>
                                                                <th className="uk-width-2-10 uk-text-left">HOD</th>
                                                                <th className="desktop uk-width-2-10 uk-text-left" id="action">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {table.map(table => (
                                                                <tr className="uk-text-left" key={table.dept_id}>
                                                                    <td className="uk-text-left">{sr++}</td>
                                                                    <td className="uk-text-left" >{table.dept_name}</td>
                                                                    <td className="uk-text-left">{table.hod_name}</td>
                                                                    <td className="desktop uk-text-left">
                                                                        <a href="javascript: void(0)" data-uk-modal="{target:'#edit_department'}" onClick={() => clickEditDept({ table })}>
                                                                            <i className="md-icon material-icons"></i>
                                                                        </a>
                                                                        <a href="javascript: void(0)" data-uk-modal="{target:'#deletemodal'}" onClick={() => setDeleteId({ table })}>
                                                                            <i className="md-icon material-icons"></i>
                                                                        </a>
                                                                    </td>
                                                                </tr>))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="uk-width-medium-1-3">
                <div className="uk-modal" id="add_department">
                    <div className="uk-modal-dialog">
                        <div className="uk-modal-header">
                            <h3 className="uk-modal-title">Add Department</h3>
                        </div>

                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label class="required">Department Name</label>
                                <input type="text" value={deptName} onChange={inputDeptName} className="input-count md-input" maxLength="60" autoComplete="off" />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <div className="parsley-row">
                                    <label htmlFor="message">Department Description</label>
                                    <textarea className="md-input" value={deptDesc} onChange={inputDeptDesc} cols="10" rows="1" data-parsley-trigger="keyup" data-parsley-minlength="20" data-parsley-maxlength="300" data-parsley-validation-threshold="10" />
                                </div>
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label>HOD Name</label>
                                <select value={hodId} onChange={inputHodId} className="input-count md-input">
                                    <option value=" "></option>
                                    {usertable.map(hdpt => (<option value={hdpt.user_id}>{hdpt.user_full_name}</option>))}
                                </select>
                            </div>
                        </div>

                        <div className="uk-modal-footer uk-text-right">
                            <button id="savedept" type="button" className="md-btn md-btn-flat md-btn-flat-primary" onClick={clickSaveDept}>Save</button>
                            <button type="button" id="modal_add_activity" className="md-btn md-btn-flat uk-modal-close" >Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="uk-width-medium-1-3">
                <div className="uk-modal" id="edit_department">
                    <div className="uk-modal-dialog">
                        <div className="uk-modal-header">
                            <h3 className="uk-modal-title">Department Details</h3>
                        </div>

                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">Department Name</label>
                                <input type="text" value={deptName} onChange={inputDeptName} className="input-count md-input" maxLength="60" />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <div className="parsley-row">
                                    <label htmlFor="message">Department Description</label>
                                    <textarea className="md-input" value={deptDesc} onChange={inputDeptDesc} cols="10" rows="1" data-parsley-trigger="keyup" data-parsley-minlength="20" data-parsley-maxlength="300" data-parsley-validation-threshold="10" />
                                </div>
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label>HOD Name</label>
                                <select value={hodId} onChange={inputHodId} className="input-count md-input"><option value=" "></option>
                                    {usertable.map(hdpt => (<option value={hdpt.user_id}>{hdpt.user_full_name}</option>))}
                                </select>
                            </div>
                        </div>

                        <div className="uk-modal-footer uk-text-right">
                            <button type="button" id="update_dept" className="md-btn md-btn-flat md-btn-flat-primary" onClick={clickUpdateDept}>Update</button>
                            <button type="button" id="model_update" className="md-btn md-btn-flat uk-modal-close" >Cancel</button>
                        </div>
                    </div>
                </div>
                <div className="uk-modal" id="update_department">
                    <div className="uk-modal-dialog">
                        <button type="button" className="uk-modal-close uk-close"></button>
                    </div>
                </div>

                <div className="uk-modal" id="deletemodal">
                    <div className="uk-modal-dialog">
                        <button type="button" className="uk-modal-close uk-close"></button>
                        <p className="uk-text-bold"></p>
                        <p>Are you sure you want to delete this department?</p>
                        <div className="uk-modal-footer uk-text-right">
                            <button type="button" className="md-btn md-btn-flat uk-modal-close" onClick={() => deleteuser(delete_id)}>Yes</button>
                            <button className="md-btn md-btn-flat uk-modal-close">No</button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Department;
