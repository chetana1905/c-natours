const AppError = require("../utils/AppError");

const MongooseError  = function(message){
  return new AppError(message , 500);
}

const ValidationError = function(message){
    return new AppError(message , 400);
}

const JsonWebTokenError = function(message){
    return new AppError(message, 400);
}

const typeError = function(message){
    return new AppError(message, 400);
}
const TokenExpiredError = function (message){
    return new AppError(message , 401);
}

const ErrorHandler = (err , req, res, next) => {
    console.log("message",err);

    err.statusCode = err.statusCode ? err.statusCode : 500;
    err.message  = err.message;
    err.status = err.status || "error";

    if(err.name == "ValidationError"){
        err = ValidationError(err.message);
    }
    else if(err.name == "MongooseError"){
        err = MongooseError(err.message);
    }
    else if(err.name =="JsonWebTokenError"){
        err = JsonWebTokenError(err.message);
    }
    else if(err.name == "TypeError"){
        err = typeError(err.message);
    }
    else if(err.name =="TokenExpiredError"){
        err = TokenExpiredError("Token Expired. Please login again!");
    }

    res.status(err.statusCode).json({
        status : err.status,
        message : err.message
    });
}


module.exports = ErrorHandler;