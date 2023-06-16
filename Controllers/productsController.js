const mongoose = require("mongoose");
const Products = require("../Model/productsModel");
const Categories = require("../Model/categoriesModel");
const multer = require("multer");
const sharp = require("sharp");


// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb)=>{
//     cb(null, "public/img/products")
//   },
//   filename: (req, file, cb)=>{
//     const ext = file.mimetype.split('/')[1]
//     cb(null, `product-${req.user.id}-${Date.now()}.${ext}`)
//   }
// })
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

exports.uploadProductPhotos = upload.single('mainImage')
exports.ResizePhotoUpload = async(req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `products-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.file.filename}`);
  next()
};
exports.getProducts = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};

exports.createProducts = async (req, res) => {
  try {
    const content = req.body;
    if (req.file) content.mainImage=req.file.filename
    if (!content) throw new Error("Please enter the product details");
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
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};

exports.getAProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Products.findById(id);
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};

exports.deleteAProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Products.findById(id);
    res.status(204).json({
      message: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};

exports.updateProducts = async (req, res) => {
  try {
    const id = req.params.id;
    const content = req.body;
    const data = await Products.findByIdAndUpdate(id, content, {
      new: true,
      runValidators: true,
    }).select("-password");
    await data.save();
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};
