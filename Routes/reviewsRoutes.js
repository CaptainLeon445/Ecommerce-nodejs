const express = require("express");
const Router = express.Router();
const {
  getReviews,
  createReviews,
  getAReview,
  updateReviews,
  deleteAReview,
} = require("../Controllers/reviewsController");
const { authProtect } = require("../Controllers/authConrollers");

Router.route("/").get(getReviews)
Router.route("/:prdId").post(authProtect,createReviews);
Router.route("/:id").get(getAReview).patch(authProtect,updateReviews).delete(authProtect,deleteAReview);
module.exports = Router;
