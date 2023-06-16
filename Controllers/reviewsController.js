const { default: mongoose } = require("mongoose")
const Products = require("../Model/productsModel")
const Reviews=require("../Model/reviewsModel")

exports.getReviews=async(req, res)=>{
    try{
        const data=await Reviews.find()
        res.status(200).json({
            message:"success",
            results:data.length,
            data
        })
    }catch(err){
        res.status(400).json({
            message:"success",
            err:err.message
        })
    }
}

exports.createReviews=async(req, res)=>{
    try{
        req.body.product=req.params.prdId
        const review=req.body;
        if(!review) throw new Error("Review is blank!")
        const data=await Reviews.create(review)
        res.status(201).json({
            message:"success",
            data
        })
    }catch(err){
        res.status(400).json({
            message:"success",
            err:err.message
        })
    }
}

exports.getAReview=async(req, res)=>{
    try{
        const id=req.params.id
        const data=await Reviews.findById(id)
        res.status(200).json({
            message:"success",
            data
        })
    }catch(err){
        res.status(400).json({
            message:"success",
            err:err.message
        })
    }
}

exports.deleteAReview=async(req, res)=>{
    try{
        const id=req.params.id
        await Reviews.findById(id)
        res.status(204).json({
            message:"success",
            data:null
        })
    }catch(err){
        res.status(400).json({
            message:"success",
            err:err.message
        })
    }
}

exports.updateReviews=async(req, res)=>{
    try{
        const id=req.params.id
        const content=req.body
        const data=await Reviews.findByIdAndUpdate(id, content, {
            new:true,
            runValidators:true
        })
        await data.save()
        res.status(200).json({
            message:"success",
            data
        })
    }catch(err){
        res.status(400).json({
            message:"success",
            err:err.message
        })
    }
}