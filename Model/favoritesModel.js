const mongoose = require("mongoose")

const favoriteSchema = mongoose.Schema({
    favorite: {
        type: Boolean,
        // default: false
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "Users",
        required:[true, "favorite product must belong to a user"]
    },
    product:{
        type: mongoose.Schema.ObjectId,
        ref: "Products",
        required:[true, "favorite product must belong to a product"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
})
favoriteSchema.pre(/^find/, function(next){
    this.populate({
        path: "product",
        select: "-createdAt -updatedAt -__v"
    }).populate({
        path: "user",
        select: "email"
    })
    next()
})
favoriteSchema.pre(/^findOne/, function(next){
    this.populate({
        path: "product",
        select: "name"
    }).populate({
        path: "user",
        select: "email"
    })
    next()
})
const favorites = mongoose.model("favorites", favoriteSchema)
module.exports=favorites;