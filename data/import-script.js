// this script will import data from json file and inputs into database and also can delete all data 
// this script will be run by command line - node data/data-import.js --delete &&  node data/data-import.js --import
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../models/TourModel');
const Users = require("../models/UserModel");
const Reviews = require("../models/ReviewModel");
console.log("in script");
// for registerig our config file in node app
const database = process.env.ATLAS_DB.replace('<PASSWORD>', process.env.ATLAS_DB_PW);

// connecting to db using mongoose driver
mongoose.connect(database).then(con => {
    console.log("Database connection successfull");
});

var filename = __dirname +'/tours.json';
const tour_data = JSON.parse(fs.readFileSync(filename,'utf-8'));

var filename = __dirname +'/users.json';
const user_data = JSON.parse(fs.readFileSync(filename,'utf-8'));
var filename = __dirname +'/reviews.json';
const review_data = JSON.parse(fs.readFileSync(filename,'utf-8'));
const importData = async() => {
    try{
            await Tour.create(tour_data);
            await Users.create(user_data , {validateBeforeSave:false});
            await Reviews.create(review_data);
            process.kill();
    }catch(err){
            console.log(err);
            process.kill();
    }
}


const deleteData = async () =>{
    try{
       await Tour.deleteMany();
        await Users.deleteMany();
        await Reviews.deleteMany();
        console.log("data deleted Sucessfully");
        process.kill();
    }catch(err){
        console.log(err);
    }
}


if(process.argv[2] == "--import"){
    importData();
}else if(process.argv[2] == "--delete"){
    deleteData();
}else{
    process.kill();
}