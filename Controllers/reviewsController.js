const Reviews=require("../Model/reviewsModel")
const AppError = require("../utils/appError")
const catchAsyncError = require("../utils/catchAsyncError")

exports.getReviews=catchAsyncError(async (req, res, next)=>{
        const data=await Reviews.find()
        res.status(200).json({
            message:"success",
            results:data.length,
            data
        })
})

exports.createReviews=catchAsyncError(async (req, res, next)=>{
        req.body.product=req.params.prdId
        const review=req.body;
        if(!review) throw new Error("Review is blank!")
        const data=await Reviews.create(review)
        res.status(201).json({
            message:"success",
            data
        })
})

exports.getAReview=catchAsyncError(async (req, res, next)=>{
        const id=req.params.id
        const data=await Reviews.findById(id)
        if (!data){
            return next(new AppError("No data with the specifed ID", 400))
          }
        res.status(200).json({
            message:"success",
            data
        })
})

exports.deleteAReview=catchAsyncError(async (req, res, next)=>{
        const id=req.params.id
        const data=await Reviews.findById(id)
        if (!data){
            return next(new AppError("No data with the specifed ID", 400))
          }
        res.status(204).json({
            message:"success",
            data:null
        })
})

exports.updateReviews=catchAsyncError(async (req, res, next)=>{
        const id=req.params.id
        const content=req.body
        const data=await Reviews.findByIdAndUpdate(id, content, {
            new:true,
            runValidators:true
        })
        if (!data){
            return next(new AppError("No data with the specifed ID", 400))
          }
        await data.save()
        res.status(200).json({
            message:"success",
            data
        })
})