const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlLocalMongoose = require("passport-local-mongoose");

const userSchema = Schema({
    email : {
        type : String,
        required : true
    },

})

userSchema.plugin(passportlLocalMongoose);

module.exports = mongoose.model("User", userSchema);