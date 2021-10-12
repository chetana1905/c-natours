const express = require('express');
const Router = express.Router();
const bookingController = require('../controllers/bookingsController');


Router.post("/book-tour",bookingController.bookTour);

Router.route('/:id')
.get(bookingController.getBookingDetails)
.delete(bookingController.deleteBooking);


module.exports = Router;