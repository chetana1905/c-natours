const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

// configure env file
dotenv.config({path:'./config.env'});

// configure mongo db ann connect to it
const database = process.env.ATLAS_DB.replace("<PASSWORD>", process.env.ATLAS_DB_PW);

// connecting to mongo db atlas server using connect method which returns promise
mongoose.connect(database)
.then((res)=> {
    console.log("connected successfully");
}).catch((err)=> {
   console.log("db eroorr",err)
});

const port = process.env.PORT ? process.env.PORT : 3000;
// listening to port 
const server = app.listen( port, () => {
    console.log("listening to port");
})

process.on('unhandledRejection', err => {
    console.log('unhadnled rejection', err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})

/*this is for handling dynos ( sent in heroku ) which sends sigterm signals. (imp commnnds - heroku ps:restart ( this manually restarts server resulting in sending sigterm signal*/
process.on('SIGTERM', () => {
    console.log("handling sigterm signal ");
    server.close(()=> {
        console.log('server terminating');
    })
})