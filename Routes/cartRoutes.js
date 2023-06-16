const express = require("express");
const Router = express.Router();
const { createCart, getCart, deleteCart, getToal } = require("../Controllers/cartController");
const { authProtect, restrictTo } = require("../Controllers/authConrollers");
Router.use(authProtect, restrictTo("admin"))
Router.route("/").get(getCart)
Router.route("/total").get(getToal)
Router.route("/add/:prdId").post(createCart);
Router.route("/remove/:prdId").delete(deleteCart);
module.exports = Router;
