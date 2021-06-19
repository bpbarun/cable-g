import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import $ from 'jquery';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const apiUrl = localStorage.getItem('apiBaseUrl');
const notify = (msg) => toast(msg);
const completed_media = [];

const MyUploader = (prop) => {
  const activityId = prop.act_id;
  const getUploadParams = ({ file, meta }) => {
    const body = new FormData();
    body.append('file', file);
    body.append('activity_id', prop.act_id);
    body.append('upload_meta_id', meta.id);
    let url = apiUrl + '/api/activity/assets/upload';
    return {
      url: url, headers: { 'Token-Code': localStorage.getItem('token_code') }, body
    }
  }
  let handleChangeStatus = ({ meta, file }, status) => {
    if (status === 'done') {
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
          if (response.status == '200') {
            if (typeof (prop.setActivityMediaNames) === 'function') {
              completed_media.push(meta.id);
              prop.setActivityMediaNames(response.data.data);
              $('.dzu-submitButton').trigger('click');
            }
          } else {
            notify('Getting error to upload the media please try again later.');
            return false;
          }
        })
        .catch(err => console.log('error log'));
    }
    // console.log('file handlechnage', status, meta, file)
  }
  let handleSubmit = (files, allFiles) => {
    while (!!completed_media.length) {
      let id = completed_media.pop();
      allFiles.map(f => {
        if (f.meta.id == id) {
          f.remove();
        }
      });
    };
  }
  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="*"
    />
  )
}
export default MyUploader;