const mongoose = require("mongoose");
const Products = require("../Model/productsModel");
const Categories = require("../Model/categoriesModel");

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
    // filter by Category
    const category = await Categories.find(queryStr);
    if (category.length !== 0) {
      const ctgId = new mongoose.Types.ObjectId(category[0]._id);
      query = Products.find({ category: ctgId });
    }

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
