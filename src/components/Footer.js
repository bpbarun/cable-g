import React,{useState,useEffect} from 'react';
import axios from 'axios';

function Footer() {
    const apiUrl = localStorage.getItem('apiBaseUrl');

    const [totalCount,setTotalCount] = useState([]);
    useEffect(() => {
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
            if(response.data.status){
                setTotalCount(response.data.data);
            }
        })
    },[]);
  return (
    <div>
        <footer id="footer" className="footerColor"  >
    	<React.Fragment>
            <marquee scrollamount="6" style={{paddingTop: "13px"}}  >
   	         {totalCount.map(data =>(
             <label style={{padding:"10px"}} key={data.dept_id}> {data.dept_name}   :     {data.alert_activity}</label>
             ))}
            </marquee>
    	</React.Fragment>
    	
        </footer>
    </div>
  );
}
export default Footer;
