/* eslint-disable */
import "@babel/polyfill";
import {login , signup , forgetPw} from "./login";
import {updateUser}  from "./settings";
import { bookTour } from "./book";

const login_btn = document.querySelector(".login-btn");
const path_name = window.location.pathname;
const user_update_form  = document.querySelector(".user-update");
const update_pw_form = document.querySelector(".update-pw-form");
const book_tour = document.querySelector("#book_tour");
const sign_up = document.querySelector('.sign-up');
const forget_pw = document.querySelector('.forget_pw_btn');

if(path_name =='/login' || path_name =='/signup' || path_name == '/forgot-pw'){
    document.querySelector('body').classList.add('body-back');
}else{
    console.log('in tour path',path_name);
    document.querySelector('nav').classList.add('bg-dark');
    document.querySelector('footer').classList.add('bg-dark');
}

if(login_btn){
    login_btn.addEventListener('click', function(){
        const email = document.getElementsByName("email")[0].value;
        const pass = document.getElementsByName("password")[0].value;
        login(email,pass);
    })
}

if(user_update_form){
    
   user_update_form.addEventListener('click', function(){
      
        const name = document.getElementsByName('name')[0].value;
        const email = document.getElementsByName('email')[0].value;
        const photo = document.getElementsByName('photo')[0].files[0];
       
        const form = new FormData();
        form.append('email',email);
        form.append('name',name);
        form.append('photo',photo);
        updateUser(form);
    })
}

if(update_pw_form){
    update_pw_form.addEventListener("submit" , function(e){
        e.preventDefault();
        const form = new FormData();
        const old_password = document.getElementById('current_pw').value;
        const new_password =  document.getElementById('new_pw').value;
        const confirm_pw =  document.getElementById('confirm_pw').value;
        
        updateUser({old_password , new_password , confirm_pw}, "password");
    })
}

if(book_tour){
    book_tour.addEventListener('click', function(){
        const tourId = book_tour.dataset.tour_id;
        bookTour(tourId);
    })
}


if(sign_up){
    sign_up.addEventListener('click', function(){
        const email = document.getElementsByName('email')[0].value;
        const name = document.getElementsByName('name')[0].value;
        const password = document.getElementsByName('password')[0].value;
        const confirm_password = document.getElementsByName('confirm_pw')[0].value;
    
         signup({email,name,password,confirm_password});   
    })
 
}


if(forget_pw){
    forget_pw.addEventListener('click', function(){
        const email = document.getElementById('email').value;
        forgetPw(email);
    })
}