const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image :  {
        type : String,
        default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fhouse&psig=AOvVaw0sPtWK_IClmhETVvc2i0sm&ust=1728903995634000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJjfj4ybi4kDFQAAAAAdAAAAABAE",
        set : (v)=> v===""?"https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fhouse&psig=AOvVaw0sPtWK_IClmhETVvc2i0sm&ust=1728903995634000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJjfj4ybi4kDFQAAAAAdAAAAABAE" : v,
    },
    price : Number,
    location : String,
    country : String,
})

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;