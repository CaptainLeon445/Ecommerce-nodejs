const express = require("express");
const Router = express.Router();
const { getfavorites, createfavorites, getUserfavoriteDetails, getUserfavorites } = require("../Controllers/favoritesController");
const { authProtect } = require("../Controllers/authConrollers");

Router.use(authProtect)
Router.route("/").get(getfavorites)
Router.route("/product/:prdId").post(createfavorites);
Router.route("/products").get(getUserfavorites);
Router.route("/product/:prdId/details").get(getUserfavoriteDetails);
module.exports = Router;
