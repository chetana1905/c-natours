const userModel = require("../../models/UserModel");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/AppError");
const {promisify} = require("util");
const Email = require("../../utils/Email");
const crypto = require("crypto");
const Multer = require("multer");
const Sharp = require("sharp");
const App = require("../../app");

const signJwt = (userId) => {
    const token = jwt.sign({_id:userId}, process.env.JWT , {expiresIn:process.env.JWT_EXPIRES});
    return token;
}

//sending token in response
const sendToken = (userId,res,statusCode) => {

    // sign token
    const token = signJwt(userId);

    // set cookie options
    const cookieOption = {
        expires : new Date(Date.now() + process.env.JWT_EXPIRES * 24*60*60*1000),
        http:true,
        // secure:true
    }

    // send cookies in response
    res.cookie("jwt",token , cookieOption);
    res.status(statusCode).json({
        status:"success",
        token
    });
}

// This middleware checks for user authorization and authentication for api routes
exports.protect = async(req, res , next) => {
    
    try{
        const token = req.cookies.jwt ? req.cookies.jwt : req.headers.authorization.split(" ")[1];
        
        // check if jwt send in cookie or authorization bearer
        if(!token){
            return next(new AppError("Not authorized. Please login first!" , 401));
        }
       

        // jwt verify will automatically checks id jwt expired
        const decoded = await promisify(jwt.verify)(token, process.env.JWT);

        //check if user exists after token issued
        const user = await userModel.findById(decoded._id);
        if(!user){
            return next(new AppError("User not found!", 401));
        }

        //check if password changed after token issued
        const changed = user.changedPasswordAfter(decoded.iat);
        if(changed){
            return next(new AppError("Password Changed", 401));
        }
        //if not then set user in req 
        req.user = user;
        next();
    }catch(err){
        next(err);
    }
}


// This middleware checks for user authorization and authentication for api routes
exports.isLoggedIn = async(req, res , next) => {
   
    try{
        const token = req.cookies.jwt ? req.cookies.jwt : req.headers.authorization.split(" ")[1];
        
        // check if jwt send in cookie or authorization bearer
        if(!token){
              return next();
        }
       

        // jwt verify will automatically checks id jwt expired
        const decoded = await promisify(jwt.verify)(token, process.env.JWT);

        //check if user exists after token issued
        const user = await userModel.findById(decoded._id);
        if(!user){
             return next();
        }

        //check if password changed after token issued
        const changed = user.changedPasswordAfter(decoded.iat);
        if(changed){
            return next();
        }
        //if not then set user in req 
        req.user = user;
        res.locals.user = user;
        next();
    }catch(err){
        return next();
    }
}

// This middleware restricts to user for some routes
exports.restrict = (restrictedUsers) => {
    
    return (req, res , next) =>{
        try{
            // checks if this user type in restrictedUsers
            if(!restrictedUsers.includes(req.user.role)){
                return next(new AppError("User not authorized", 401));
            }
            next();
        }catch(err){
            next(err);
        }
    }
    
}


exports.login = async(req, res , next) => {
    console.log("in login api controller",req.body);
    try{

        if(!req.body.email && !req.body.password){
            return next(new AppError("Invalid username or password"));
        }
        // checks if user exists
        const user = await userModel.findOne({email:req.body.email}).populate("password"); // if you do not use findOne you will not be able to use schema.methods like correctpassword
        
        if(!user){
            return next(new AppError("User not found", 404));
        }
        // checks if pasword is correct
        password_matched = await user.correctPassword(req.body.password , user.password);
        if(!password_matched){
            return next(new AppError("Invalid Password", 400));
        }
        
        //sends token in response 
        sendToken(user._id,res, 200);
    }catch(err){
        next(err);
    }
}

exports.logout = (req, res, next) => {
    console.log("in logout");
    try{
        res.cookie("jwt" , '', {
            expiresIn:Date.now(),
            http:true
        })
        res.redirect("/login");
    }catch(err){
        next(err);
    }
    
}

exports.signup = async(req, res, next) => {
    try{
        
       // save data in db
         const user = await userModel.create({
                        name : req.body.name,
                        email:req.body.email,
                        password : req.body.password,
                        confirmPassword: req.body.confirmpw,
                        role: req.body.role
                    });
        
        //Send Welcome Mail to the user

        const email = new Email(`${req.protocol}://${req.hostname}:${process.env.PORT}/tours`,req.body.email);
        email.welcomeMail();
        
        // send token in response
        sendToken(user._id, res, 200);
            
    }catch(err){
        next(err);
    }
    
}

exports.forgotPassword = async(req, res, next) => {
        
    try{
         // check if user exists 
        const user = await userModel.findOne({email:req.body.email});
       
        if(!user){
            return next(new AppError("User not found!", 404));
        }

        // generate rest token and save  in db
        const reset_token = user.generateResetToken();
        const reset_string = `${req.protocol}://${req.hostname}/api/v1/user/reset-password/${reset_token}`;
    

        // save the use doc so that changed passworresttoken in doc would be saved
        user.save(); 

        //send token in mail
        let email = new Email(reset_string, req.body.email);
        sent  =  await email.sendResetTokenMail();
        
        res.status(200).json({
            status:"success",
            message : "Mail sent to your mail id . Please check "
        })

    }catch(err){
        next(err);
    }
}

exports.resetPassword = async(req, res, next) => {
    try{
        const resetToken = req.params.token;

        // create hash of the received token and check if user with same hashed token exists in db
        const hashed_token = crypto.createHash("sha256").update(resetToken).digest("hex");
        console.log(hashed_token);
        const user = await userModel.findOne({passwordResetToken:hashed_token, passwordResetExpired:{$gte:Date.now()}});
        
        if(!user){
            return next(new AppError("Invalid user",400));
        }

        // reset fields
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpired = undefined;
        user.save();
        
        res.status(200).json({
            status:"success",
            user 
        })
    }catch(err){
        next(err);
    }
}


exports.updatePassword = async(req,res,next) => {
    try{
        const {old_password , new_password , confirm_pw} = req.body;
        console.log(req.body);
         //user  Verification  
        const user = await userModel.findById(req.user._id).populate("password"); //req.user came from protect route middleware which we are using in routes
        
        //password verification
        const matched = await user.correctPassword(old_password, user.password );
        if(!matched){
            return next(new AppError("Incorrect Password", 400));
        }

         // check if confirm pw and password matches as we will disabe validate before saving
         if(new_password !== confirm_pw){
            return next(new AppError("Password and confirm password are different"));
        }


        //save  password 
        user.password = new_password;
        user.confirmPassword = confirm_pw;
         await user.save({validateBeforeSave : false}); // user.findAndUpdate() will not  execute all document middlewares
        
        // send jwt token
       sendToken(user, res , 200);

    }catch(err){
        next(err);
    }
}

// upload Photo middlware
const multerStorage = Multer.memoryStorage();
const multerFilter = (req, file, cb)=>{
    try{
        if(!file.mimetype.startsWith("image")){
            cb(new AppError("Profile Pic should be image type", 400) , false);
       }
       cb(null, true);
    }catch(err){
        cb(err, false);
    }  
}
const upload  = Multer({
    storage: multerStorage,
    fileFilter:multerFilter
})
exports.uploadMiddleware = upload.single("photo");

// resize photo middleawre
exports.resizeMiddleware = async(req, res , next) => {
    try{
        req.file.filename = `${req.user._id}-${Date.now()}-${req.file.originalname.split(".")[0]}.jpeg`;
        const sharp =  await Sharp(req.file.buffer)
        .resize(500,500)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/images/user/${req.file.filename}`);
        next();
    }catch(err){
        next(err);
    }
   
}

// filter body
exports.filterBody = (req, res, next)=> {
    if(req.body.password){
        return next(new AppError(`Please use ${req.protocol}://${req.hostname}/api/v1/user/update-password for updating your password` ,400));
    }

    if(req.file){
        req.body.photo = req.file.filename ;       
    }
    next();
}

exports.updateMe = async(req, res, next) => {
    try{
       const user = await userModel.findOneAndUpdate({_id:req.user._id}, req.body,{new : true , runValidators:true});
       req.user = user;
        res.status(200).json({
            status:"success",
            data : user
        });
    }catch(err){
        next(err);
    }
    
}
