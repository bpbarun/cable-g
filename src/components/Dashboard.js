import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import $ from 'jquery';
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import  Detail from './Detail';
import {getPropertiesForActivityDT} from './ActivitiesGenericView';
 
function Dashboard() {
    const apiUrl = localStorage.getItem('apiBaseUrl');

    const [table, setTable] = useState([]);
    const fetchData = () => {
            axios.get(apiUrl + '/api/activity/activity/getDepartmentCount',
        {
        headers: {
            'Token-Code'  : localStorage.getItem('token_code'),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*',
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
         }
        }).then(function (response) {
            $('#dt_tableExport').DataTable().destroy();
               if(response.data.status){
                    setTable(response.data.data);
                }
            $('#dt_tableExport').DataTable(getPropertiesForActivityDT());
            $('.dataTables_filter input[type="search"]').css(
                  {'width':'270','display':'inline-block'}
            );
        });
     }
    useEffect(() => {
         fetchData();
         // show();
    },[]);

    let dashboarddepartmentId;
    const getId = (data) => {
        localStorage.setItem("dashboarddepartmentId", data.dept_id);
        localStorage.setItem("dashboarddepartmentName", data.dept_name);
    }

 var sr = 1;                                                                                                                                                                                                                                 
    return (
   
    <div>
    
    <div id="page_content">
        <div id="page_content_inner"> 
            <div className="wrap">
                <div className="loading">
                    <div className="bounceball"></div>
                    <div className="text">NOW LOADING...</div>
                </div>
            </div>
        <h4 className="heading_a uk-margin-bottom">Departments Dashboard</h4>
            <div className="uk-grid" >
                <div className="uk-width-medium-1-12">
                    <div className="md-card" data-uk-grid-margin>
                        <div className="md-card-content small-padding">
                            <ul data-uk-tab="{connect:'#tabs_anim1', animation:'scale'}">
                               
                            </ul>
                            <ul id="tabs_anim1" className="uk-switcher uk-margin">
                                <div className="md-card uk-margin-medium-bottom">
                                     <div className="md-card-content small-padding">
                                        <div className="uk-overflow-container">
                                            <table id="dt_tableExport" className="uk-table uk-table-nowrap table_check">
                                                <thead>
                                                <tr>
                                                    <th className="uk-width-1-10 uk-text-left sno-column">S.No.</th>
                                                    <th className="uk-width-2-10 uk-text-left">Department</th>
                                                    <th className="desktop uk-width-2-10 uk-text-left">HOD</th>
                                                    <th className="desktop uk-width-2-10 uk-text-left width">Total Activities</th>
                                                    <th className="uk-width-2-10 uk-text-left width">Alert Activities</th>
                                                    <th className="desktop uk-width-2-10 uk-text-left width">Upcoming Activities</th>
                                                    <th className="desktop uk-width-2-10 uk-text-left width">Completed Activities</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                      {table.map(table=>(
                                                        <tr className="uk-text-left" key={table.dept_id}>
                                                        <td className="uk-text-left" style={{width:"3%"}}>{sr++}</td>
                                                        <td className="uk-text-left"><NavLink to='/Detail' onClick={()=>getId(table)} style={{color:"black"}}>{table.dept_name}</NavLink></td>
                                                        <td className="desktop uk-text-left" value={table.hod_id}>{table.hod_name}</td>
                                                        <td className="desktop uk-text-left">{table.total_activity}</td>
                                                        <td className="uk-text-left" style={{color:"#D70000"}}>{table.alert_activity}</td>
                                                        <td className="desktop uk-text-left">{table.upcomming_count}</td>
                                                        <td className="desktop uk-text-left">{table.complated_count}</td>
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

 </div>
  );
}
export default Dashboard;
