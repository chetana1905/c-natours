const tourModel = require("../models/TourModel")
const BookingModel = require("../models/BookingModel");

exports.myAccount = (req, res, next) => {
    try{
        res.status(200).render('settings',{
            title : 'My Account'
        });
    }catch(err){
        next(err);
    }
}

exports.changePassword = (req, res, next) => {
    res.status(200).render('password.pug',{
        title:'Change Password'
    });
}

exports.mybookings = async(req, res, next) => {
    try{
        if(req.query.booked_tour){
            const tour = await tourModel.findById(req.query.booked_tour);
            // save data in booking model
            const booking_saved = await BookingModel.create({
                amount:tour.price,
                tour:tour._id,
                user:req.user._id
            })
            res.redirect("/my-bookings");
        }else{
            const mytours = await BookingModel.find({user:req.user._id},{_id:0,tour:1});
            const tours = mytours.map(mytour => {
                return mytour.tour;
            })
            console.log(tours);
            res.status(200).render('tours',{
                title : 'My Tours',
                tours
            });
        }
        
    }catch(err){
        next(err);
    }
}