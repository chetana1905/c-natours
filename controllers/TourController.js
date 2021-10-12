const tourModel = require("../models/TourModel");
const reviewModel = require('../models/ReviewModel');

exports.getTours = async(req, res, next) => {
    
  try{
     const tours = await tourModel.find();
        res.status(200).render('tours',{
            title:'Tours',
            tours
        });     
    }catch(err){
        console.log(err);
    }
    
}

exports.getTour = async(req, res, next) => {
  try{
    var tour = await tourModel.findById(req.params.id).populate({path:'reviews'});
    const guides = tour.guides.map(user => {
        return  user.role = (user.role == 'lead-guide') ? 'Lead Guide' : 'Tour Guide';
    });
    tour.guides = guides;
    
    console.log(tour.reviews);

    res.status(200).render('tour',{
      title : tour.slug.toUpperCase(),
      tour
    })
  }catch(err){
    next(err);
  }
  
}