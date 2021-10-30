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
        /* this is used when webhooks were not used . Webhooks are only implemented on server ex heroku not on localhost*/
        // if(req.query.booked_tour){ // this redirected from stripe checkout 
        //     const tour = await tourModel.findById(req.query.booked_tour);
        //     // save data in booking model
        //     const booking_saved = await BookingModel.create({
        //         amount:tour.price,
        //         tour:tour._id,
        //         user:req.user._id
        //     })
        //     res.redirect("/my-bookings");
        // }else{
            const mytours = await BookingModel.find({user:req.user._id},{_id:0,tour:1});
            const tours = mytours.map(mytour => {
                return mytour.tour;
            })
            
            res.status(200).render('tours',{
                title : 'My Tours',
                tours,
                path: req.path
            });
        //}
        
    }catch(err){
        next(err);
    }
}