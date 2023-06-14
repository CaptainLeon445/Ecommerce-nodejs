const express = require("express");
const Router = express.Router();
const {
  getProducts,
  createProducts,
  getAProduct,
  deleteAProduct,
  updateProducts,
} = require("../Controllers/productsController");

Router.route("/").get(getProducts)
Router.route("/:ctgId").post(createProducts)
Router.route("/:id").get(getAProduct).patch(updateProducts).delete(deleteAProduct);
module.exports = Router;
