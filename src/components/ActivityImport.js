import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Dropzone from 'react-dropzone-uploader'
import { ToastContainer, toast } from 'react-toastify';
import ActivityExportExcel from './ActivityExportExcel';
import { getPropertiesForActivityDT, dateFormat } from './ActivitiesGenericView';

import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = localStorage.getItem('apiBaseUrl');
const notify = (msg) => toast(msg);
const completed_upload = [];

function ActivityImport() {
    const apiUrl = localStorage.getItem('apiBaseUrl');

    const [impRecords, setImpRecords] = useState([]);
    const [refreshD, setRefreshD] = useState(new Date().getTime());

    function fetchData() {
        axios.get(apiUrl + '/api/activity/import/',
            {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            }).then(function (response) {
                $('#impRecord').DataTable().destroy();
                if (!!response.data.status) {
                    setImpRecords(response.data.data);
                }
                else {
                    setImpRecords([]);
                }
                $('#impRecord').DataTable(getPropertiesForActivityDT([3, 4]));
                $('.dataTables_filter input[type="search"]').css(
                    { 'width': '270px', 'display': 'inline-block' }
                );
            }).catch(err => console.log('response catch', err));
    };

    useEffect(() => {
        fetchData();
        console.log("refresh time @ " + refreshD);
    }, [refreshD]);

    function refreshData() {
        setRefreshD(new Date().getTime());
    };

    let getUploadParams = ({ file, meta }) => {
        const body = new FormData();
        body.append('file', file);
        body.append('upload_meta_id', meta.id);
        let url = apiUrl + '/api/activity/import/upload';
        return { url: url, headers: { 'Token-Code': localStorage.getItem('token_code') }, body }
    }
    let handleChangeStatus = ({ meta, file }, status) => {
        if (status === 'done') {
            axios.get(apiUrl + '/api/activity/import/import/', {
                headers: {
                    'Token-Code': localStorage.getItem('token_code'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
                }
            })
                .then((response) => {
                    if (response.status == '200') {
                        completed_upload.push(meta.id);
                        refreshData();
                        $('.dzu-submitButton').trigger('click');
                    } else {
                        notify('Getting error to upload please try again later.');
                        return false;
                    }
                })
                .catch(err => console.log('error log'));
        }
    }
    let handleSubmit = (files, allFiles) => {
        while (!!completed_upload.length) {
            let id = completed_upload.pop();
            allFiles.map(f => {
                if (f.meta.id == id) {
                    f.remove();
                }
            });
        };
    }

    var sr = 1;
    return (
        <div>
            <div id="page_content">
                <div id="page_content_inner">
                    <h4 className="heading_a uk-margin-bottom">Import Activities</h4>
                    <div>
                        <ToastContainer />
                    </div>
                    <div className="uk-width-medium-1-12">
                        <div className="md-card">
                            <div className="md-card-content small-padding">
                                <ul className="uk-tab" data-uk-tab="{connect:'#tabs_anim1', animation:'scale'}">
                                    <div className="uk-vertical-align-middle uk-float-right">
                                        <span className="btnSectionClone cursor" data-uk-modal="{target:'#activity_import'}">
                                            <i className="material-icons md-36">file_upload</i>
                                        </span>
                                    </div>
                                </ul>
                                <ul id="tabs_anim1" className="uk-switcher uk-margin">
                                    <div className="md-card uk-margin-medium-bottom">
                                        <div className="md-card-content small-padding">
                                            <div className="uk-overflow-container">

                                                <table id="impRecord" className="uk-table uk-table-nowrap table_check">
                                                    <thead>
                                                        <tr>
                                                            <th className="uk-text-left width">S.No.</th>
                                                            <th className="uk-text-left uk-width-3-10">File</th>
                                                            <th className="uk-text-left width">Date</th>
                                                            <th className="uk-text-left width">Total</th>
                                                            <th className="uk-text-left width">Success</th>
                                                            <th className="uk-text-left width">Rejected</th>
                                                            <th className="uk-text-left width">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {impRecords.map(impRecord => (
                                                            <tr key={impRecord.act_id}>
                                                                <td className="uk-text-left cell-vertical-middle">{sr++}</td>
                                                                <td className="uk-text-left cell-vertical-middle cell-wrap">{impRecord.imp_name}</td>
                                                                <td className="uk-text-left cell-vertical-middle">{dateFormat(impRecord.created_on)}</td>
                                                                <td className="uk-text-left cell-vertical-middle">{impRecord.total}</td>
                                                                <td className="uk-text-left cell-vertical-middle">{impRecord.success}</td>
                                                                <td className="uk-text-left cell-vertical-middle">{impRecord.fail}</td>
                                                                <td>
                                                                    {(impRecord.fail > 0) && <div className="md-card-list-wrapper">
                                                                        <div className="uk-container-center">
                                                                            <div className="md-card-list">
                                                                                <div className="md-card-list-item-menu" data-uk-dropdown="{mode:'click',pos:'bottom-right'}">
                                                                                    <a href="#" className="md-icon material-icons">&#xE5D4;</a>
                                                                                    <div className="uk-dropdown uk-dropdown-small">
                                                                                        <ul className="uk-nav">
                                                                                            {(impRecord.fail > 0) && <li> <ActivityExportExcel filename={impRecord.imp_name + " - reject"} failed_activity={impRecord.failed_activity} /></li>}
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>}
                                                                </td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="uk-width-medium-1-3">
                        <div className="uk-modal" id="activity_import">
                            <div className="uk-modal-dialog">
                                <div className="uk-modal-header">
                                    <h3 className="uk-modal-title">Upload Activity File</h3>
                                </div>

                                <Dropzone
                                    getUploadParams={getUploadParams}
                                    onChangeStatus={handleChangeStatus}
                                    onSubmit={handleSubmit}
                                    accept="*"
                                />
                                <div className="uk-modal-footer uk-text-right">
                                    <button type="button" className="md-btn md-btn-flat uk-modal-close" id="activity_import_cancel">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
}

export default ActivityImport;

