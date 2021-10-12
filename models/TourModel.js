const mongoose = require("mongoose");

const Schema =  new mongoose.Schema({
    name : {
        type:String,
        required : [true,"A tour must have a name"],
        unique: true,
        maxlength : [40 , "A tour must have length less than 40"],
        minlength : [10 , "A tour must have  lenght more than or  equals t 10"],
        // validate : [validator.isAlpha, "Name should be alphbatical. And no special char like space"] // this is also a custom validator we have used by installing validator package in node
    } ,
    difficulty : {
        type : String,
        required : true ,
        enum: ['easy','medium','difficult']
    },
    rating : {
        type : Number,
        default : 2.5
    },
    slug:String,
    duration : {
        type : Number,
        required : [true , "A tour must have a duration"]
    },
    maxGroupSize : {
        type : Number,
        required : [true , "A tour must have a group Size"]
    },
    ratingsAverage : {
        type : Number,
        default : 4.5
    },
    priceDiscount: {
        type : Number,
        validate : { // this is a custom validator we applied
            validator : function(val){
                return val < this.price
            },
        message : "Discount price {{VALUE}} should be below than regular price"
        }
    },
    ratingsQuantity : {
        type : Number,
        default : 0
    },
    price : {
        required : true,
        type : Number
    },
    summary : {
        type : String,
        trim : true,
        required : [true , 'A Tour must have a summary']
    },
    description : {
        type : String,
        trim : true
    },
    imageCover : {
        type : String,
        required : [true , "A tour must have an image cover"]
    },
    images: [String],
    createdAt : {
        type : Date,
        default : Date.now()
    },
    startDates : {
        type : [String],
        required : true
    },
    startLocation:{
        type :{
            type: String,
            default : 'Point',
            enum:['Point']
        },
        coordinates:[Number],
        description : String,
        address : String
    },
    locations :[
        {
            type :{
                type:String,
                default : 'Point',
                enum:['Point']
                
            },
            coordinates:[Number],
            description : String,
            day:Number
        }
    ],
    guides : [{
        type : mongoose.Schema.ObjectId, // id of the refrenced collections's document
        ref : "user" // refers to the referncing collection
    }],
    __v: {
        type:Number,
        select:false
    }

},{
    toJSON : {virtuals : true}, // set true so that virtual fields can be shown in data after quering
    toObject: {virtuals : true}
});


// Query middlerware
Schema.pre(/^find/ ,function(next){
    this.populate('guides'); // this will populate the referenced user doc in the guide field where we provided _id of users
    next();
})

Schema.virtual('reviews', {
    ref : 'review',
    localField : '_id',
    foreignField:'tour'
})

const tourModel = new mongoose.model('tour',Schema);


module.exports = tourModel;