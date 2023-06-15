const Products = require("../Model/productsModel");
const favorites = require("../Model/favoritesModel");
const User = require("../Model/userModel");


exports.getfavorites = async (req, res) => {
  try {
    const data = await favorites.find();
    res.status(200).json({
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

exports.createfavorites = async (req, res) => {
  try {
    req.body.product = req.params.prdId;
    req.body.user = req.params.userId;
    let favorite = await favorites.findOne({user:req.body.user, product:req.body.product});
    req.body.favorite=true
    if (favorite) {
        if (favorite.favorite===true || favorite.favorite===false){
                favorite = await favorites.findByIdAndUpdate(
                  favorite._id,
                  { favorite: !favorite.favorite },
                  {
                    new: true,
                    runValidators: true,
                  }
                );
                favorite.save()
        }
    } else {
      favorite = await favorites.create(req.body);
    }
    res.status(201).json({
      message: "success",
      favorite,
    });
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};

exports.getUserfavorites = async (req, res) => {
  try {
    // req.body.product = req.params.prdId;
    req.body.user = req.params.userId;
    const data = await favorites.find({user: req.body.user});
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

exports.getUserfavoriteDetails = async (req, res) => {
    try {
      req.body.product = req.params.prdId;
      req.body.user = req.params.userId;
      const data = await favorites.find({user: req.body.user, product: req.body.product});
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




