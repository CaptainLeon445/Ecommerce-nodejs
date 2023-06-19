const mongoose = require("mongoose");
const Products = require("../Model/productsModel");
const multer = require("multer");
const sharp = require("sharp");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter =(req, file, cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null, true)
  }else{
    cb( new Error("Upload only image"), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadProductPhotos = upload.fields([
 { name: "mainImage", maxCount: 1},
 { name: "images", maxCount: 10},

])
exports.ResizePhotoUpload = async(req, res, next) => {
  if (!req.files.mainImage || !req.files.images) return next(new Error("Additional image not added!"));

  // mainImage
  req.body.mainImage = `products-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.files.mainImage[0].buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.body.mainImage}`);

  // images
  req.body.images = []
  await Promise.all(
     req.files.images.map(async (file, index)=>{
      const filename = `products-${req.user.id}-${Date.now()}-${index}.jpeg`;
      await sharp(file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);
        req.body.images.push(filename)
    })
  )
    
  next()
};

exports.getProducts = catchAsyncError(async (req, res, next) => {
    // 1 Filtering
    const queryObj = { ...req.query };
    const excludefields = ["sort"];
    excludefields.forEach((el) => delete queryObj[el]);
    
    // Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );
    let query = Products.find(queryStr);
    
    // // filter by Category
    // const category = await Categories.find(req.params.ctgId);
    // if (category.length !== 0) {
    //   const ctgId = new mongoose.Types.ObjectId(category[0]._id);
    //   query = Products.find({ category: ctgId });
    // }

    // sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const data = await query;
    return res.status(200).json({
      message: "success",
      results: data.length,
      data,
    });
});

exports.createProducts = catchAsyncError(async (req, res, next) => {
    const content = req.body;
    if (req.file) content.mainImage=req.files.filename
    if (!content){
        return next(new AppError("Kindly enter the product details", 400))
    };
    // create products under a category
    const categoryId = req.params.ctgId;
    // convert the category id to mongoose id type and parse into the request body
    content.category = new mongoose.Types.ObjectId(categoryId);
    const data = await Products.create(content);
    res.status(201).json({
      message: "success",
      results: data.length,
      data,
    });
});

exports.getAProduct = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const data = await Products.findById(id);
    if (!data){
      return next(new AppError("No data with the specifed ID", 400))
    }
    res.status(200).json({
      message: "success",
      data,
    });
});

exports.deleteAProduct = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const data =await Products.findById(id);
    if (!data){
      return next(new AppError("No data with the specifed ID", 400))
    }
    res.status(204).json({
      message: "success",
      data: null,
    });
});

exports.updateProducts = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const content = req.body;
    const data = await Products.findByIdAndUpdate(id, content, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!data){
      return next(new AppError("No data with the specifed ID", 400))
    }
    await data.save();
    res.status(200).json({
      message: "success",
      data,
    });
});
