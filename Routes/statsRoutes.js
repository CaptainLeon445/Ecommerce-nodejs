const express=require("express");
const { SimilarProducts }=require("../Controllers/similarProducts")
const Router=express.Router()

Router.route("/similar-products/:ctgId").get(SimilarProducts)
module.exports=Router;