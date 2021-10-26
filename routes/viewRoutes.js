const express = require("express");
const LoginController = require('../controllers/loginController');
const TourController = require('../controllers/TourController');
const AuthController = require("../api/controllers/authController");
const AccountController = require('../controllers/AccountController');
const Router = express.Router();

Router.get("/", (req, res, next) => {
    res.redirect("/login");
});
Router.get("/login", LoginController.login);
Router.get("/signup",LoginController.signup);
Router.get('/forgot-pw', LoginController.forgotPw);

Router.use(AuthController.isLoggedIn);

Router.get('/tours', LoginController.redirects, TourController.getTours);
Router.get('/tour/:id', LoginController.redirects ,TourController.getTour);
Router.get('/me' ,LoginController.redirects, AccountController.myAccount);
Router.get('/change-password',LoginController.redirects, AccountController.changePassword);
Router.get('/my-bookings' ,LoginController.redirects,AccountController.mybookings);

module.exports = Router;