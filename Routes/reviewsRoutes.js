const express = require("express");
const Router = express.Router();
const {
  getReviews,
  createReviews,
  getAReview,
  updateReviews,
  deleteAReview,
} = require("../Controllers/reviewsController");

Router.route("/").get(getReviews)
Router.route("/:prdId").post(createReviews);
Router.route("/:id").get(getAReview).patch(updateReviews).delete(deleteAReview);
module.exports = Router;
