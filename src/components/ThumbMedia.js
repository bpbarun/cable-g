import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import React, { useEffect } from 'react';
import $ from 'jquery';
import { getApiBaseURL } from './ActivitiesGenericView';

const notify = (msg) => toast(msg);
const apiUrl = localStorage.getItem('apiBaseUrl');
let mediaUrl = localStorage.getItem('mediaBaseUrl');

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  margin: 5,
  width: 110,
  height: 110,
  padding: 2,
  boxSizing: 'border-box'
};
const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};
const downloadOverlap = {
  position: 'absolute',
  paddingTop: '10%',
  paddingLeft: '4%'
}
const overlap = {
  position: 'absolute',
  right: '4px',
  bottom: '4px',
  cursor: 'pointer',
  zIndex: '1',
}

const ThumbMedia = (prop) => {
  const deleteMedia = (file) => {
    let data = { activity_id: prop.act_id }
    axios.post(apiUrl + '/api/activity/assets/delete/' + file, data, {
      headers: {
        "Token-Code": localStorage.getItem('token_code'),
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        notify('Document deleted successfully.');
        axios.get(apiUrl + '/api/activity/assets/byactivity/' + prop.act_id, {
          headers: {
            'Token-Code': localStorage.getItem('token_code'),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
          }
        })
          .then((response) => {
            if (typeof (prop.setActivityMediaNames) === 'function') {
              if (response.data.status) {
                prop.setActivityMediaNames(response.data.data);
              }
              else {
                prop.setActivityMediaNames([])
              }
            }
          })
          .catch(err => console.log('response catch', err));
      })
      .catch(err => console.log('response catch', err));
  }
  if (typeof (mediaUrl) !== 'undefined' || mediaUrl == "") {
    getApiBaseURL();
    mediaUrl = localStorage.getItem('mediaBaseUrl');
  }
  const mediaNames = prop.mediaNames;
  let thumbs = "";
  if (typeof (mediaNames) !== 'undefined') {
    thumbs = mediaNames.map(asset => (
      <div className="md-card" style={thumb} key={asset.name}>
        <a href={mediaUrl + '/download.php?activity_id=' + prop.act_id + '&name=' + asset.name} download>
          <img src={asset.type.startsWith("image") ? mediaUrl + '/' + prop.act_id + '/' + asset.name : '/assets/img/attachment.png'} title={asset.name} style={img} />
        </a>
        { !(!!prop.closeState) && <i style={overlap} className="md-icon material-icons" onClick={() => deleteMedia(asset.name)}>&#xE872;</i> }
      </div>
    ));
  }
  return thumbs;
}
export default ThumbMedia;
