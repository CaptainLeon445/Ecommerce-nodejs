const mongoose=require("mongoose")

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true, "Product's name cannot be blank"],
        minLength:[2, "Name of product must at least contain five characters"],
        unique:true,
        // lowercase: true
    },
    price:{
        type:Number,
        default:0,
        validate(value){
            if (value==0 || value<0){
                throw new Error(`Price should be greater than zero`)
            }
            else{
                return true;
            }
        }
    },
    discount:{
        type:Number,
        default:0,
        validate(value){
            if (value >1 || value < 0){
                throw new Error('Discount should between 0 and 1')
            }else{
                return true
            }
        },
    },
    description: {
        type: String,
        trim: true,
        maxlength: [450, "Description must not exceed 450 characters"]
    },
    category:{
        type: mongoose.Schema.ObjectId,
        ref: "Categories"
    },
    mainImage: String,
    imageURL:[{type:String}],
    size:[{type:String}],
    color:[{type:String}],
    ratingsAverage:{
        type: Number,
        default: 4.5
    },
    quantity:{
        type:Number,
        default:0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt:Date,
}, {
    strictPopulate: false
})
productSchema.pre("save", function(next){
    this.updatedAt = Date.now();
    this.discount = this.price - (this.price * this.discount)
    next()
})

productSchema.pre(/^findByIdAnd/, function(next){
    if(!this.isModidied("price") || !this.isModidied("discount")) return next()
    this.updatedAt = Date.now();
    this.discount = this.price - (this.price * this.discount)
    next()
})

productSchema.pre(/^find/, function(next){
    this.populate({
        path: "category",
        select: "-createdAt -_id -__v"
    })
    next()
})

const Products=mongoose.model("Products", productSchema)
module.exports=Products;