const Categories = require("../Model/categoriesModel");
const AppError = require("../utils/appError");
const catchAsyncError = require("../utils/catchAsyncError");

exports.getCategories = catchAsyncError(async (req, res, next) => {
    const filter = req.query;
    let data = await Categories.find();

    if (filter) {
      data = await Categories.find(filter);
    }
    if (data.length !== 0) {
      return res.status(200).json({
        message: "success",
        results: data.length,
        data,
      });
    } else {
      throw new Error("No data found!");
    }
});

exports.createCategories = catchAsyncError(async (req, res, next) => {
    const content = req.body;
    const data = await Categories.create(content);
    res.status(201).json({
      message: "success",
      results: data.length,
      data,
    });
});

exports.getAcategory = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const data = await Categories.findById(id);
    if (!data){
      return next(new AppError("No data with the specifed ID", 400))
    }
    res.status(200).json({
      message: "success",
      data,
    });
});

exports.deleteAcategory = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const data =await Categories.findById(id);
    if (!data){
      return next(new AppError("No data with the specifed ID", 400))
    }
    res.status(204).json({
      message: "success",
      data: null,
    });
});

exports.updateCategories = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const content = req.body;
    const data = await Categories.findByIdAndUpdate(id, content, {
      new: true,
      runValidators: true,
    });
    if (!data){
      return next(new AppError("No data with the specifed ID", 400))
    }
    await data.save();
    res.status(200).json({
      message: "success",
      data,
    });
});
