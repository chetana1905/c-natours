const mongoose  = require("mongoose");

const Schema  =  new mongoose.Schema({
    review :{
        type:String,
        required : [true,"Please provide review"]
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true, "Please provide rating"]
    },
    tour:{
        type: mongoose.Schema.ObjectId,
        ref:'tour'
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'user'
    }
},{
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
})

Schema.pre(/^find/, function(next){
    this.populate('user');
    next();
})
const ReviewModel = new mongoose.model("review", Schema);

module.exports = ReviewModel;