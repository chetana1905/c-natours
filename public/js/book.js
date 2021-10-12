/* eslint-disable*/
import axios from "axios";
import { showAlert } from "./alert";

export const bookTour = async(tourId) => {
    await axios({
        url:'/api/v1/bookings/book-tour',
        method : "POST",
        data:{tourId}
    }).then(res => {
            window.location.assign(res.data.session_url);
    }).catch(err => {
        showAlert('error', "Something Went Wrong . Please try again later!");
    })
}