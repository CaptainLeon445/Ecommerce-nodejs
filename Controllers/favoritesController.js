const favorites = require("../Model/favoritesModel");
const catchAsyncError = require("../utils/catchAsyncError");

exports.getfavorites = catchAsyncError(async (req, res, next) => {
    const data = await favorites.find();
    res.status(200).json({
      message: "success",
      results: data.length,
      data,
    });
});

exports.createfavorites = catchAsyncError(async (req, res, next) => {
    req.body.product = req.params.prdId;
    req.body.user = req.user.id;
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
});

exports.getUserfavorites = catchAsyncError(async (req, res, next) => {
    // req.body.product = req.params.prdId;
    req.body.user =  req.user.id;
    const data = await favorites.find({user: req.body.user});
    if (!data){
      return next(new AppError("No data", 400))
    }
    res.status(200).json({
      message: "success",
      data,
    });
});

exports.getUserfavoriteDetails = catchAsyncError(async (req, res, next) => {

      req.body.product = req.params.prdId;
      req.body.user =  req.user.id;
      const data = await favorites.find({user: req.body.user, product: req.body.product});
      res.status(200).json({
        message: "success",
        data,
      });
  });




