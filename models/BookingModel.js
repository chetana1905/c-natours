const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    tour :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'tour'
    },
    transactionId:{
        type:String
    },
    amount:Number
},{
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
});

Schema.pre(/^find/, function(next){
    this.populate('tour');
    next();
})
const bookModel = new mongoose.model('booking', Schema);

module.exports = bookModel;