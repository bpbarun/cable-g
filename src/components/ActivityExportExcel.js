import React from 'react';
import moment from 'moment';
import ReactExport from "react-export-excel";
import { checkMyActivity, checkAdminUser, isAdmin, dateFormatSave, dateFormat, dateFormatEdit, checkTodayExceed, checkActivityValidation } from './ActivitiesGenericView';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ActivityExportExcel(prop) {
    const isAdminUser = isAdmin();
    const pdept_col = true;
    if (isAdminUser) {
        if (typeof (prop.failed_activity) === 'string') {
            return (
                <ExcelFile filename={prop.filename} element={<span className="btnSectionClone cursor"><i className="material-icons">file_download</i>Rejected Activities</span>}>
                    <ExcelSheet data={JSON.parse(prop.failed_activity)} name="Reject">
                        <ExcelColumn label="Name" value="Name" />
                        <ExcelColumn label="Description" value="Description" />
                        <ExcelColumn label="Primary Department" value="Primary Department" />
                        <ExcelColumn label="Secondary Department" value="Secondary Department" />
                        <ExcelColumn label="Start Date" value="Start Date" />
                        <ExcelColumn label="End Date" value="End Date" />
                        <ExcelColumn label="Alert Date" value="Alert Date" />
                        <ExcelColumn label="Show to All" value="Show to All" />
                        <ExcelColumn label="Allow e-mail" value="Allow e-mail" />
                        <ExcelColumn label="Error" value="Error" />
                    </ExcelSheet>
                </ExcelFile>
            )
        }
        return (
            <ExcelFile filename={prop.filename} element={<span className="btnSectionClone cursor"><i className="material-icons md-36">file_download</i></span>}>
                <ExcelSheet data={prop.activeActivities} name="Active">
                    <ExcelColumn label="Name" value="act_name" />
                    <ExcelColumn label="Description" value="act_desc" />
                    <ExcelColumn label="Primary Department" value="pdept_name" />
                    <ExcelColumn label="Secondary Department" value="sdept_name" />
                    <ExcelColumn label="Start Date" value={(activity) => dateFormat(activity.start_date)} />
                    <ExcelColumn label="End Date" value={(activity) => dateFormat(activity.end_date)} />
                    <ExcelColumn label="Alert Date" value={(activity) => dateFormat(activity.alert_date)} />
                    <ExcelColumn label="Show to All" value={(activity) => (activity.show_to_all == 1) ? "True" : "False"} />
                    <ExcelColumn label="Allow e-mail" value={(activity) => (activity.allow_email == 1) ? "True" : "False"} />
                </ExcelSheet>
                <ExcelSheet data={prop.completedActivities} name="Completed">
                    <ExcelColumn label="Name" value="act_name" />
                    <ExcelColumn label="Description" value="act_desc" />
                    <ExcelColumn label="Primary Department" value="pdept_name" />
                    <ExcelColumn label="Secondary Department" value="sdept_name" />
                    <ExcelColumn label="Start Date" value={(activity) => dateFormat(activity.start_date)} />
                    <ExcelColumn label="Start Date" value={(activity) => dateFormat(activity.start_date)} />
                    <ExcelColumn label="End Date" value={(activity) => dateFormat(activity.end_date)} />
                    <ExcelColumn label="Alert Date" value={(activity) => dateFormat(activity.alert_date)} />
                    <ExcelColumn label="Show to All" value={(activity) => (activity.show_to_all == 1) ? "True" : "False"} />
                    <ExcelColumn label="Allow e-mail" value={(activity) => (activity.allow_email == 1) ? "True" : "False"} />
                    <ExcelColumn label="Submission Date" value={(activity) => dateFormat(activity.close_submission_date)} />
                    <ExcelColumn label="Overdue By"
                        value={(activity) => (moment(activity.close_submission_date).from(moment(activity.end_date))).replace('in ', '').replace(/(.+)ago/, 'On Time')} />
                </ExcelSheet>
            </ExcelFile>
        );
    }
    else {
        return (
            <ExcelFile filename={prop.filename} element={<span className="btnSectionClone cursor"><i className="material-icons md-36">file_download</i></span>}>
                <ExcelSheet data={prop.activeActivities} name="Active">
                    <ExcelColumn label="Name" value="act_name" />
                    <ExcelColumn label="Description" value="act_desc" />
                    <ExcelColumn label="Primary Department" value="pdept_name" />
                    <ExcelColumn label="Secondary Department" value="sdept_name" />
                    <ExcelColumn label="Start Date" value={(activity) => dateFormat(activity.start_date)} />
                    <ExcelColumn label="End Date" value={(activity) => dateFormat(activity.end_date)} />
                    <ExcelColumn label="Alert Date" value={(activity) => dateFormat(activity.alert_date)} />
                </ExcelSheet>
                <ExcelSheet data={prop.completedActivities} name="Completed">
                    <ExcelColumn label="Name" value="act_name" />
                    <ExcelColumn label="Description" value="act_desc" />
                    <ExcelColumn label="Primary Department" value="pdept_name" />
                    <ExcelColumn label="Secondary Department" value="sdept_name" />
                    <ExcelColumn label="Start Date" value={(activity) => dateFormat(activity.start_date)} />
                    <ExcelColumn label="Start Date" value={(activity) => dateFormat(activity.start_date)} />
                    <ExcelColumn label="End Date" value={(activity) => dateFormat(activity.end_date)} />
                    <ExcelColumn label="Alert Date" value={(activity) => dateFormat(activity.alert_date)} />
                    <ExcelColumn label="Submission Date" value={(activity) => dateFormat(activity.close_submission_date)} />
                    <ExcelColumn label="Overdue By"
                        value={(activity) => (moment(activity.close_submission_date).from(moment(activity.end_date))).replace('in ', '').replace(/(.+)ago/, 'On Time')} />
                </ExcelSheet>
            </ExcelFile>
        );
    }
};
