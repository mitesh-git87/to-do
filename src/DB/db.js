const mongoose = require('mongoose');


async function connectDB() {
    try{
        console.log("connecting to DB......");

        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.log("Skipping DB connection (missing MONGODB_URI)");
            return;
        }

        mongoose.set("strictQuery", true);
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
        console.log("connected succesfully to DB");
        
    }catch(err) {
        console.log("not connected to DB",err.message)
        throw err;
    }
      
}





module.exports = connectDB;
