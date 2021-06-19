import axios from 'axios';
import MultiSelect from 'react-multiple-select-dropdown-lite';
import 'react-multiple-select-dropdown-lite/dist/index.css';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const classNames = require("classnames");

export function getPropertiesForActivityDT(dateColumnIds) {
    return {
        pageLength: 100,
        lengthMenu: [10, 50, 100, 250, 500],
        pagingType: 'simple',
        language: {
            "emptyTable": 'No records found',
            "searchPlaceholder": 'Search',
            "search": '',
        },
        columnDefs: [{ type: 'date', targets: dateColumnIds }],
    };
}

export function getApiBaseURL() {
    axios
        .get('/login/config.json')
        .then(({ data }) => {
            let protocal = ((data.host.protocal != '') ? data.host.protocal : 'https') + '://';
            let domain = (data.host.domain != 'undefined') ? data.host.domain : '';
            let port = (data.host.port != '') ? ':' + data.host.port : '';
            let folderName = (data.host.subFolder != '') ? '/' + data.host.subFolder : '';
            localStorage.setItem('apiBaseUrl', protocal + domain + port + folderName);
            localStorage.setItem('mediaBaseUrl', protocal + domain + port + data.media.path);
        })
        .catch((err) => { })
}

export function checkLogin() {
    getApiBaseURL();
    const apiUrl = localStorage.getItem('apiBaseUrl');
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
            if (typeof (response.data.data) == 'undefined') {
                window.location = "/login";
            }
            const tableData = response.data.data;
        }).catch(function (error) {
            if (error.response) {
                if (error.response.status == 401 || 404) {
                    localStorage.removeItem('token_code')
                    window.location = "/login";
                }
            }
        });
}

export function checkAdminUser() {
    return (localStorage.getItem('user_id') == 1) ? true : false;
}

export function isAdmin() {
    return (localStorage.getItem('user_id') == 1) ? true : false;
}

export function checkMyActivity(pdept_id) {
    let dept_id = localStorage.getItem('dept_id');
    var arr_pdept_id = pdept_id.split(',');
    return arr_pdept_id.includes(dept_id);
}

export function dateFormatSave(idate) {
    let odate = moment(idate, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    return odate;
}

export function dateFormat(idate) {
    var odate = moment(idate).format('DD-MMM-YYYY');
    return (odate == 'Invalid date') ? 'Pending / On hold' : odate;
}

export function dateFormatEdit(idate) {
    var odate = moment(idate).format('DD-MMM-YYYY');
    return (odate == 'Invalid date') ? '' : odate;
}

export function checkTodayExceed(idate) {
    const dateLimit = moment(idate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    const now = moment()
    if (dateLimit.isValid() && now.isAfter(dateLimit)) {
        return true;
    }
    else {
        return false;
    }
}

export function checkActivityValidation(data) {
    if (data.act_name == '') {
        notify('Fields marked with * are mandatory.');
        return false;
    } else if (data.pdept_id == "0,,0") {
        notify('Fields marked with * are mandatory.');
        return false;
    }
}

const notify = (msg) => toast(msg);

export function ActivityCount(countactivity) {
    return (
        <div className="uk-grid uk-grid-width-large-1-4 uk-grid-width-1-2 uk-grid-match uk-grid-small uk-sortable" data-uk-grid-margin>
            <div>
                <div className="md-card">
                    <div className="md-card-content small-padding">
                        <div className="uk-float-right uk-margin-top uk-margin-small-right">
                            <img className="md-user-image md-list-addon-avatar" src="/assets/icons/activity-state/TotalActivity.png" alt="" />
                        </div>
                        <span className="uk-text-muted uk-text-small">Total Activities</span>
                        <h2 className="uk-margin-remove">
                            <span className="countUpMe">{countactivity.total_activity}</span>
                        </h2>
                    </div>
                </div>
            </div>
            <div>
                <div className="md-card bgred">
                    <div className="md-card-content small-padding">
                        <div className="uk-float-right uk-margin-top uk-margin-small-right">
                            <img className="md-user-image md-list-addon-avatar" src="/assets/icons/activity-state/AlertActivity.png" alt="" />
                        </div>
                        <span className="uk-text-muted uk-text-small colwhite">Alert Activities</span>
                        <h2 className="uk-margin-remove">
                            <span className="countUpMe blinking">{countactivity.alert_activity}</span>
                        </h2>
                    </div>
                </div>
            </div>
            <div>
                <div className="md-card">
                    <div className="md-card-content small-padding">
                        <div className="uk-float-right uk-margin-top uk-margin-small-right">
                            <img className="md-user-image md-list-addon-avatar" src="/assets/icons/activity-state/UpcomingActivity.png" alt="" />
                        </div>
                        <span className="uk-text-muted uk-text-small">Upcoming Activities</span>
                        <h2 className="uk-margin-remove">
                            <span className="countUpMe">{countactivity.upcomming_activity}</span>
                        </h2>
                    </div>
                </div>
            </div>
            <div>
                <div className="md-card">
                    <div className="md-card-content small-padding">
                        <div className="uk-float-right uk-margin-top uk-margin-small-right">
                            <img className="md-user-image md-list-addon-avatar" src="/assets/icons/activity-state/CompletedActivity.png" alt="" />
                        </div>
                        <span className="uk-text-muted uk-text-small">Completed Activities</span>
                        <h2 className="uk-margin-remove">
                            <span className="countUpMe">{countactivity.completed_activity}</span>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}
