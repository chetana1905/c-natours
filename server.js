const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

// configure env file
dotenv.config({path:'./config.env'});

// configure mongo db ann connect to it
const database = process.env.ATLAS_DB.replace("<PASSWORD>", process.env.ATLAS_DB_PW);

// connecting to mongo db atlas server using connect method which returns promise
mongoose.connect(database)
.then(()=> {
console.log("connected successfully");
}).catch((err)=> {
console.log(err);
});

const port = process.env.PORT ? process.env.PORT : 3000;
// listening to port 
app.listen( port, () => {
    console.log("listening to port");
})