/* eslint-disable */
import axios from "axios";
import {showAlert} from "./alert";

export const updateUser = async(data ,type='') => {
    var url = '';
    var options = '';
    if(type == 'password'){
        url = 'api/v1/user/update-password';
        options = {
            headers:{
            "Content-Type" : "application/json"
        }
      }
    }else{
        url = 'api/v1/user/update-me';
        options = {
            headers:{
            "Content-Type" : "multipart/form-data"
        }
      }
    }
    await axios({
           url,
           method:'PATCH',
           data,
           options
       }).then(res => {
            showAlert("success", "Updated Successfully!");
            setTimeout(() => {
                window.location.href = "/me";
            }, 5000);
       }).catch(err => {
            showAlert("error", "Something Went wrong ! Please try again");
       })
}


