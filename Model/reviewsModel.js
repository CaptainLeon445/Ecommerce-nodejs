const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
    reviews: {
        type: String,
        required: true,
        trim: true
    },
    ratings:{
        type: Number,
        default: 0,
        min: [1, "Ratings should be greater than 0 "],
        max: [5, "Ratings should not be more than 5"],
    },
    product:{
        type: mongoose.Schema.ObjectId,
        ref: "Products",
        required:[true, "Review must belong to a Product"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
}, {
    strictPopulate: false
})
reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: "product",
        select: "name"
    })
    next()
})
const Reviews = mongoose.model("Reviews", reviewSchema)
module.exports=Reviews;