const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


const Schema = new mongoose.Schema({
    name : {
        type:String,
        required:[true, "User Should have a name"]
    },
    email : {
        type:String,
        unique:true,
        required:[true , "Please provide email"],
        lowercase:true,
        validate:[validator.isEmail , "Please provide valid email "]
    },
    password : {
        type: String,
        minlength:6,
        required:[true, "Please provide password"],
        select : false
    },
    confirmPassword : {
        type: String,
        validate:{
                validator: function(val){
                    return this.password == val;
                },
                message : "Password and confirm password are different"
        } 
    },
    passwordChangedAt : {
        type:Date,
        default: Date.now()
    },
    passwordResetToken : String,
    passwordResetExpired :Date,
    role : {
        type: String,
        enum:["admin","user","guide"],
        default:"user"
    },
    photo : String
});


// encrypt password before saving password in document
Schema.pre("save" , async function(next){
    if(!this.isModified("password")){
        return next();
    }
    
    this.password = await bcrypt.hash(this.password , 12);
    this.confirmPassword = undefined;
    next();
})


//update passwordChangedAt field whenever password changes 
Schema.pre("save", function(next){
    
    if(this.isModified("password") && !this.isNew){
        this.passwordChangedAt = Date.now();
    }
    
    next();
})


// created a method on schema to check if password is correct 
Schema.methods.correctPassword =  async(inputPassword , password) =>{
    console.log(inputPassword , password);
    return await bcrypt.compare(inputPassword, password);
}

// method to check if password is changed after jwt token issued
Schema.methods.changedPasswordAfter =  function(jwttimestamp){
    
    if(this.passwordChangedAt){
          var changedTime = parseInt(this.passwordChangedAt.getTime()/1000 , 10);
          return changedTime > jwttimestamp;
      }
     return false;
}

//doc method to create reset token
Schema.methods.generateResetToken = function(){
    // creating a random value
    const reset_token = crypto.randomBytes(32).toString("hex");
    
    // crypting random token
    const hashed_token = crypto.createHash("sha256").update(reset_token).digest("hex");
    // saving in resettoken field
    this.passwordResetToken = hashed_token;
    this.passwordResetExpired = Date.now() + 5 * 60 * 1000;
    console.log(this);
    return reset_token;
}


const userModel = new mongoose.model("user",Schema);
module.exports = userModel;