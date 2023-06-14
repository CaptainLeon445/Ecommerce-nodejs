const express = require("express");
const Router = express.Router();
const { createCart, getCart, deleteCart } = require("../Controllers/cartController");

Router.route("/").get(getCart)
Router.route("/add/:prdId").post(createCart);
Router.route("/remove/:prdId").delete(deleteCart);
module.exports = Router;
