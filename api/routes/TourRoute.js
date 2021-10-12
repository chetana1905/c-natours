const express = require("express");
const Router = express.Router();
const tourController = require("../controllers/TourController");
const AuthController = require("../controllers/authController");

// Middleware
Router.use(AuthController.protect);
// Routes

Router.get("/" , tourController.getTours);
Router.route("/:id")
.get(tourController.getTour)
.post(tourController.createTour)
.delete(tourController.deleteTour);


module.exports = Router;