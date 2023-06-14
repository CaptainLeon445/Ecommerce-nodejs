const mongoose = require("mongoose")

const CartSchema = mongoose.Schema({
   
    quantity:{
        type: Number,
        default: 0,
    },
    product:{
        type: mongoose.Schema.ObjectId,
        ref: "Products",
        required:[true, "Cart item must belong to a Product"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
}, {
    strictPopulate: false
})
CartSchema.pre(/^find/, function(next){
    this.populate({
        path: "product",
        select: "name"
    })
    next()
})
const Cart = mongoose.model("Cart", CartSchema)
module.exports=Cart;