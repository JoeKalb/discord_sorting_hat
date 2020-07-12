const mongoose = require('mongoose')

const BirthdaySchema = new mongoose.Schema({
    discordID:{
        type:String,
        required:true,
        unique:true
    },
    month:{
        type:Number,
        required:true
    },
    day:{
        type:Number,
        required:true
    }
})

const Birthday = mongoose.model("Birthday", BirthdaySchema)
module.exports = Birthday