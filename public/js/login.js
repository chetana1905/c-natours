import axios from "axios";
import {showAlert} from './alert';

export const login = async(email, password) => {
  await axios({
                url:'api/v1/user/login',
                method:'POST',
                data:{email , password}
            }).then(response => {
                
                if(response.data.status == 'success'){
                    window.location.assign('/tours');
                }
            }).catch(err => {
                console.log(err);
                showAlert('error' , err.response.data.message);
            });
  
}

export const signup = async(data) => {
    
   await axios({
        url:'api/v1/user/signUp',
        method:'POST',
        data
   }).then(res =>{
       window.location.assign('/tours');
   }).catch(err => {
       showAlert("error",err.response.data.message);
   });
}

export const forgetPw = async(email) =>{
    await axios({
        url:'api/v1/user/forget-password',
        method:'POST',
        data:{email}
    }).then(res => {
        console.log(res);
        showAlert('success',res.data.message);
         
    }).catch(err =>{
        showAlert('error', err.response.data.message);
    })
}