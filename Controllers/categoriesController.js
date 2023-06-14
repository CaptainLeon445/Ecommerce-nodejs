const Categories = require("../Model/categoriesModel");

exports.getCategories = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};

exports.createCategories = async (req, res) => {
  try {
    const content = req.body;
    const data = await Categories.create(content);
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

exports.getAcategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Categories.findById(id);
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

exports.deleteAcategory = async (req, res) => {
  try {
    const id = req.params.id;
    await Categories.findById(id);
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

exports.updateCategories = async (req, res) => {
  try {
    const id = req.params.id;
    const content = req.body;
    const data = await Categories.findByIdAndUpdate(id, content, {
      new: true,
      runValidators: true,
    });
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
