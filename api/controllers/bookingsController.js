const bookingModel = require('../../models/BookingModel');
const tourModel = require('../../models/TourModel');


exports.bookTour = async(req, res, next) => {
   console.log("request protocol",req.protocol);
   console.log("request hostname",req.hostname);
   console.log("req host", req.host);
    try
    {
        const Stripe = require('stripe')(process.env.STRIPE_SK);
        const tour = await tourModel.findById(req.body.tourId);  
        const response =  await Stripe.checkout.sessions.create({
            success_url : `${req.protocol}://${req.hostname}/my-bookings?booked_tour=${req.body.tourId}`,
            cancel_url : `${req.protocol}://${req.hostname}/tour/${req.body.tourId}`,
            line_items:[
                {
                  // TODO: replace this with the `price` of the product you want to sell
                  price_data :{
                    currency: "usd" ,
                    unit_amount : tour.price *100,
                    product_data: {
                        name : tour.name
                    }
                },
                  quantity: 1,
                },
              ],
            payment_method_types: [
                'card',
            ],
            customer_email: req.user.email,
            client_reference_id: req.body.tourId,
            mode:'payment'
        })
        res.status(200).json({
            status:"success",
            session_url:response.url
        });
            
    }catch(err){
        next(err);
    }
}


exports.getBookingDetails = (req, res, next) => {

    next();
}

exports.deleteBooking = (req, res , next) => {
    next();
}