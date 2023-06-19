const Categories = require("../Model/categoriesModel")
const Products= require("../Model/productsModel")
const catchAsyncError = require("../utils/catchAsyncError")

exports.SimilarProducts =catchAsyncError(async(req, res, next)=>{
     const similar = await Categories.findById(req.params.ctgId)
     const doc = await Products.aggregate([
        {
          $lookup: {
            from: 'categories', // The name of the referenced model's collection (Category)
            localField: 'category', // The field in the current collection (Product) that references the Category model
            foreignField: '_id', // The field in the referenced collection (Category) that is referenced by the localField
            as: 'category' // The name of the array field to store the matched category
          }
        },
        {
          $unwind: '$category' // Unwind the category array field to get individual documents
        },
        {
          $match: {
            'category.name': similar.name // Match products with the desired category name
          }
        }, 
        {
            $sample: { size: 5}
        }
      ])
      if (!doc){
        return next(new AppError("No data with the specifed ID", 400))
      }
      res.status(400).json({
        message: "success",
        results: doc.length,
        doc
    })
})