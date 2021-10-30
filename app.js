const express = require("express");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const tourApiRouter = require("./api/routes/TourRoute");
const userApiRouter = require("./api/routes/UserRoute");
const reviewApiRouter = require("./api/routes/ReviewRoute");
const bookingApiRouter = require("./api/routes/BookingRoute");
const bookingController = require("./api/controllers/bookingsController");
const ReviewModel = require("./models/ReviewModel");
const viewRoutes = require("./routes/viewRoutes");
const ErrorHandler = require("./controllers/ErrorController");
const AppError = require("./utils/AppError");
const App = express();

App.enable('trust proxy'); // used to ablt to read req.headers['x-forwarded-proto'] value as heroku proxy changes req
const path = require("path");


// middlewares
App.set("view engine" , "pug");
App.set("views", path.join(__dirname,"./views"));
App.use(express.static(path.join(__dirname,"./public")));
App.use(express.json()); // used to parse req body
App.use(cookieParser());// used to parse cookies in req
App.use(compression());

// Frontend Routes
App.use("/", viewRoutes);

// API Routes
App.use("/api/v1/tours" , tourApiRouter);
App.use("/api/v1/user",userApiRouter);
App.use("/api/v1/bookings",bookingApiRouter);
// App.use("/api/v1/reviews",reviewApiRouter);

App.all("*", (req, res, next) =>{
    console.log('in all');
    next(new AppError(`This route ${req.originalUrl} does not exists` , 404));
})
// using errorglobalHandler
App.use(ErrorHandler);
module.exports = App;