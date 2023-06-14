const express = require("express");
const Router = express.Router();
const { createCart, getCart, deleteCart, getToal } = require("../Controllers/cartController");

Router.route("/").get(getCart)
Router.route("/total").get(getToal)
Router.route("/add/:prdId").post(createCart);
Router.route("/remove/:prdId").delete(deleteCart);
module.exports = Router;
