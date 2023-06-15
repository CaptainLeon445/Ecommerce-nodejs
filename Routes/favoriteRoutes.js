const express = require("express");
const Router = express.Router();
const { getfavorites, createfavorites } = require("../Controllers/favoritesController");

Router.route("/").get(getfavorites)
Router.route("/:userId/product/:prdId").post(createfavorites);
// Router.route("/:id").get(getAReview).patch(updateReviews).delete(deleteAReview);
module.exports = Router;
