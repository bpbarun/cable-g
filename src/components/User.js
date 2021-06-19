"use strict";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPropertiesForActivityDT } from './ActivitiesGenericView';

function User() {
    const apiUrl = localStorage.getItem('apiBaseUrl');

    const [user_name_data, setName] = useState('');
    const [user_full_name, setFullName] = useState('');
    const [password_data, setPassword] = useState('');
    const [mobile_no_data, setMobile] = useState('');
    const [email_data, setEmail] = useState('');
    const [dept, setDept] = useState([]);
    let [userDeleteId, setUserId] = useState('');
    const [deptvalue, setDeptValue] = useState('');
    const [table, setTable] = useState([]);

    const [edit_u_name, setEditName] = useState(" ");
    const [edit_u_fname, setEditFullName] = useState(" ");
    const [edit_u_dept, setEditDept] = useState(" ");
    const [edit_u_password, setEditPassword] = useState(" ");
    const [edit_u_mobile, setEditMobile] = useState(" ");
    const [edit_u_email, setEditEmail] = useState(" ");
    const [edit_u_id, setEditUserId] = useState(" ");

    const fetchData = () => {
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

            })
            .catch(err =>
                console.log('getting error', err)
            );
    }


    useEffect(() => {
        fetchData();
    }, []);

    const notify = (msg) => toast(msg);

    const inputEventName = (event) => {
        setName(event.target.value);
    };
    const inputEventFullName = (event) => {
        setFullName(event.target.value);
    };
    const inputEventDeptId = (event) => {
        setDeptValue(event.target.value);
    };
    const inputEventPassword = (event) => {
        setPassword(event.target.value);
    };
    const inputEventMobile = (event) => {
        setMobile(event.target.value);
    };
    const inputEventEmail = (event) => {
        setEmail(event.target.value);
    };
    function checkUserValidation(data) {
        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        var mailformat = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
        if (data.user_name == '') {
            console.log('user_name', data.user_name_data);
            notify('Fields marked with * are mandatory.');
            return false;
        } else if (data.User_full_name == '') {
            console.log('user_full_name', data.User_full_name);
            notify('Fields marked with * are mandatory.');
            return false;
        } else if (data.dept_id == '') {
            console.log('dept_id', data.dept_id);
            notify('Fields marked with * are mandatory.');
            return false;
        } else if (data.password == '') {
            console.log('password', data.password);
            notify('Fields marked with * are mandatory.');
            return false;
        } else if (data.mobile_no != "" && phoneno.test(data.mobile_no) == false) {
            console.log('mobile_no', data.mobile_no);
            notify('Fields marked with * are mandatory.');
            return false;
        } else if (data.email == '' || mailformat.test(data.email) == false) {
            console.log('email', data.email);
            notify('Fields marked with * are mandatory.');
            return false;
        }
    }

    const AddUserDetail = (e) => {
        e.preventDefault();
        let user_name = user_name_data;
        let User_full_name = user_full_name;
        let dept_id = deptvalue;
        let password = password_data;
        let mobile_no = mobile_no_data;
        let email = email_data;
        let data = {
            user_name,
            User_full_name,
            dept_id,
            password,
            mobile_no,
            email
        };
        if (checkUserValidation(data) == false) { return false }
        axios.post(apiUrl + '/api/user/user/', data, {
            headers: {
                'Token-Code': localStorage.getItem('token_code'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
            }
        })
            .then((response) => {
                if (!response.data.status) {
                    notify(response.data.error);
                    return;
                }
                notify('New user successfully added.');
                setName('');
                setFullName('');
                setPassword('');
                setMobile('');
                setEmail('');
                document.getElementById('dept_id').value = "";
                document.getElementById('model_close').click();
                fetchData();
            })
            .catch(err =>
                console.log('getting error', err)
            );
    };

    function clearText() {
        document.getElementById('user_name_data').value = "";
        document.getElementById('user_full_name').value = "";
        document.getElementById('dept_id').value = "";
        document.getElementById('password_data').value = "";
        document.getElementById('mobile_no_data').value = "";
        document.getElementById('email_data').value = "";
    }

    const updateUserValue = (data) => {
        setEditName(data.table.user_name);
        setEditFullName(data.table.user_full_name);
        setEditDept(data.table.dept_id);
        setEditPassword(data.table.password);
        setEditMobile(data.table.mobile_no);
        setEditEmail(data.table.email);
        setEditUserId(data.table.user_id);
    }

    const updateUserDetail = () => {
        document.getElementById("update_user").disabled = true;
        let user_name = edit_u_name;
        let User_full_name = edit_u_fname;
        let dept_id = edit_u_dept;
        let password = edit_u_password;
        let mobile_no = edit_u_mobile;
        let email = edit_u_email;
        let userId = edit_u_id;
        let data = {
            user_name,
            User_full_name,
            dept_id,
            password,
            mobile_no,
            email
        };
        if (checkUserValidation(data) == false) {
            document.getElementById("update_user").disabled = false;
            return false;
        }
        axios.post(apiUrl + '/api/user/user/update/' + userId, data, {
            headers: {
                'Token-Code': localStorage.getItem('token_code'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
            }
        })
            .then((response) => {
                notify('User detail successfully updated.');
                document.getElementById('model_update_close').click();
                fetchData();
            })
        setTimeout(function () {
            document.getElementById("update_user").disabled = false;
        }, 2000);
    }

    const deleteUserValue = () => {
        axios.post(apiUrl + '/api/user/user/delete/' + userDeleteId, '', {
            headers: {
                'Token-Code': localStorage.getItem('token_code'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
            }
        })
            .then((response) => {
                notify('User successfully deleted.');
                fetchData();
            })
    }

    var sr = 1;

    useEffect(() => {
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
                if (response.data.status) {
                    setDept(response.data.data);
                }
            });
    }, []);

    const setDeleteId = (data) => {
        setUserId(data.table.user_id);
    }

    return (
        <div>
            <div id="page_content">
                <div id="page_content_inner">
                    <div>
                        <ToastContainer />
                    </div>

                    <h4 className="heading_a uk-margin-bottom">User Management</h4>
                    <div className="uk-grid" >
                        <div className="uk-width-medium-1-12">
                            <div className="md-card" data-uk-grid-margin>
                                <div className="md-card-content small-padding">
                                    <ul className="uk-tab" data-uk-tab="{connect:'#tabs_anim1', animation:'scale'}">
                                        <div className="uk-vertical-align-middle" style={{ float: 'right' }} data-uk-modal="{target:'#addUser'}" >
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
                                                                <th className="sno-column">S.No.</th>
                                                                <th >Name</th>
                                                                <th className="desktop">Department </th>
                                                                <th className="desktop">Mobile No</th>
                                                                <th className="desktop">Email</th>
                                                                <th style={{ width: "3%" }}>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {table.map(table => (
                                                                <tr key={table.user_id}>
                                                                    <td >{sr++}</td>
                                                                    <td >{table.user_full_name}</td>
                                                                    <td className="desktop">{table.dept_name}</td>
                                                                    <td className="desktop">{table.mobile_no}</td>
                                                                    <td className="desktop">{table.email}</td>
                                                                    <td>
                                                                        <a href="javascript:void(0)" data-uk-modal="{target:'#updateUser'}" onClick={() => updateUserValue({ table })}>
                                                                            <i className="md-icon material-icons"></i>
                                                                        </a><a data-uk-modal="{target:'#deletemodal'}" href="javascript:void(0)" onClick={() => setDeleteId({ table })}>
                                                                            <i className="md-icon material-icons"></i></a>
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
                <div className="uk-modal" id="addUser">
                    <div className="uk-modal-dialog">
                        <div className="uk-modal-header">
                            <h3 className="uk-modal-title">Add User</h3>
                        </div>

                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">Login name</label>
                                <input type="text" className="input-count md-input" id="user_name_data" value={user_name_data} onChange={inputEventName} maxLength="60" autoComplete="off" />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">User full name</label>
                                <input type="text" className="input-count md-input" id="user_full_name" value={user_full_name} onChange={inputEventFullName} maxLength="60" autoComplete="off" />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">Department</label>
                                <select name="dept_id" id="dept_id" className="md-input" onChange={inputEventDeptId}>
                                    <option value=""></option>
                                    {dept.map(dpt => (<option value={dpt.dept_id}>{dpt.dept_name}</option>))}
                                </select>
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">Password</label>
                                <input type="password" className="input-count md-input" id="password_data" value={password_data} onChange={inputEventPassword} maxLength="60" autoComplete="off" />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label>Mobile no</label>
                                <input type="text" className="input-count md-input" id="mobile_no_data" value={mobile_no_data} onChange={inputEventMobile} maxLength="60" autoComplete="off" />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">Email</label>
                                <input type="text" className="input-count md-input" id="email_data" value={email_data || ''} onChange={inputEventEmail} maxLength="60" autoComplete="off" />
                            </div>
                        </div>
                        <div className="uk-modal-footer uk-text-right">
                            <button data-uk-modal="{target:'#user'}" type="button" className="md-btn md-btn-flat md-btn-flat-primary" onClick={AddUserDetail}>Add</button>
                            <button type="button" id="model_close" className="md-btn md-btn-flat uk-modal-close" onClick={clearText}>Cancel</button>
                        </div>
                    </div>
                </div>

            </div>


            <div className="uk-width-medium-1-3">
                <div className="uk-modal" id="updateUser">
                    <div className="uk-modal-dialog">
                        <div className="uk-modal-header">
                            <h3 className="uk-modal-title">Edit User</h3>
                        </div>

                        <div className="uk-width-medium-1-1">
                            <input type="hidden" className="input-count md-input" id="user_id" value={edit_u_id} />
                        </div>

                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">Login name</label>
                                <input type="text" className="input-count md-input" autoComplete="off" id="user_name_u" value={edit_u_name} onChange={(event) => setEditName(event.target.value)} />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">User full name</label>
                                <input type="text" className="input-count md-input" autoComplete="off" id="user_full_name_u" value={edit_u_fname} onChange={(event) => setEditFullName(event.target.value)} />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">Department</label>
                                <select id="dept_id_u" value={edit_u_dept} className="input-count md-input" onChange={(event) => setEditDept(event.target.value)}>
                                    <option value=" "></option>
                                    {dept.map(pdpt => (<option value={pdpt.dept_id}>{pdpt.dept_name}</option>))}
                                </select>
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">Password</label>
                                <input type="password" className="input-count md-input" autoComplete="off" id="user_password_u" maxLength="60" value={edit_u_password} onChange={(event) => setEditPassword(event.target.value)} />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label>Mobile no</label>
                                <input type="text" className="input-count md-input" autoComplete="off" id="user_mobile_u" maxLength="60" value={edit_u_mobile} onChange={(event) => setEditMobile(event.target.value)} />
                            </div>
                        </div>
                        <div className="uk-grid" data-uk-grid-margin>
                            <div className="uk-width-medium-1-1">
                                <label className="required">Email</label>
                                <input type="text" className="input-count md-input" autoComplete="off" id="user_email_u" maxLength="60" value={edit_u_email} onChange={(event) => setEditEmail(event.target.value)} />
                            </div>
                        </div>
                        <div className="uk-modal-footer uk-text-right">
                            <button type="button" id="update_user" value="update" className="md-btn md-btn-flat md-btn-flat-primary" onClick={updateUserDetail}>Update</button>
                            <button type="button" id="model_update_close" className="md-btn md-btn-flat uk-modal-close" >Cancel</button>
                        </div>
                    </div>
                </div>

                <div className="uk-modal" id="deletemodal">
                    <div className="uk-modal-dialog">
                        <p>Are you sure you want to delete this user?</p>
                        <div className="uk-modal-footer uk-text-right">
                            <button type="button" className="md-btn md-btn-flat uk-modal-close" onClick={deleteUserValue}>Yes</button>
                            <button className="md-btn md-btn-flat uk-modal-close">No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default User;
