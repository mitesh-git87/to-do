const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    "username" :{
        type : String,
        required : true,
        unique : true
    },
    "email": {
        type : String,
        required : true,
        unique : true,
    },
    "password" :{
        type :String,
        unique : true,
    },
    "task":String,
    
    "duedate" : String,

    "description" : String

})

const userModel = mongoose.model("user", userschema);


module.exports = userModel;