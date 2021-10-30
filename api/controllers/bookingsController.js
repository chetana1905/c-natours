const bookingModel = require('../../models/BookingModel');
const tourModel = require('../../models/TourModel');
const userModel = require('../../models/UserModel');


const createBooking = async(session) => {
    const user = userModel.findOne({'email':session.customer_email},{_id}) ;
    const tour = session.client_reference_id;
    const amount = session.amount_total /100;
    const craeted = await bookingModel.create({tour, user, amount});
}

exports.bookTour = async(req, res, next) => {
    try
    {
        const Stripe = require('stripe')(process.env.STRIPE_SK);
        const tour = await tourModel.findById(req.body.tourId);  
        const response =  await Stripe.checkout.sessions.create({
            // success_url : `${req.protocol}://${req.hostname}/my-bookings?booked_tour=${req.body.tourId}`,
            // cancel_url : `${req.protocol}://${req.hostname}/tour/${req.body.tourId}`,
            success_url : `${req.protocol}://${req.get('host')}/my-bookings`,
            cancel_url : `${req.protocol}://${req.get('host')}/tour/${req.body.tourId}`,
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

exports.webhookCheckout = (req, res, next) => {
    // get stripe signature 
    const sign = req.headers['stripe-signature'];
  
    let event = '';
    try{
        const Stripe = require('stripe')(process.env.STRIPE_SK);
        event = Stripe.Webhooks.constructEvent(
            req.body,
            sign,
            process.env.STRIPE_WEBHOOK_SECRET
        );

    }catch(err){
      return res.status(400).send(`Webhook  error ${err.message}`);
    }

    if(event.type == 'checkout.session.completed'){
        createBooking(event.data.object);
    }
    res.status(200).json({received : true});
}
exports.getBookingDetails = (req, res, next) => {

    next();
}

exports.deleteBooking = (req, res , next) => {
    next();
}