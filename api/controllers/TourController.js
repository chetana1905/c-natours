const tourModel = require("../../models/TourModel");

exports.getTour = async(req, res, next) => {
    try{
        const Tour = await tourModel.findById(req.id);
        res.status(200).json({
            status : "success",
            data : Tour
        });

    }catch(err){
        console.log("err");
        next(err);
    }
    
}


exports.createTour = (req, res, next) => {
    next();
}


exports.deleteTour = (req, res, next) => {

    next();
}

exports.getTours  = async(req, res , next) => {
    try{
        const tours = await tourModel.findAll();
        res.status(200).json({
                status:"success",
                data:tours
        });
    }catch(err){
        next(err);
    }
}