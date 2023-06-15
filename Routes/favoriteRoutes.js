const express = require("express");
const Router = express.Router();
const { getfavorites, createfavorites, getUserfavoriteDetails, getUserfavorites } = require("../Controllers/favoritesController");

Router.route("/").get(getfavorites)
Router.route("/:userId/product/:prdId").post(createfavorites);
Router.route("/:userId/products").get(getUserfavorites);
Router.route("/:userId/product/:prdId/details").get(getUserfavoriteDetails);
module.exports = Router;
