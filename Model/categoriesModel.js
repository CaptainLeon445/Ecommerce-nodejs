const mongoose = require("mongoose")

const categoriesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
})

const Categories = mongoose.model("Categories", categoriesSchema)
module.exports=Categories;