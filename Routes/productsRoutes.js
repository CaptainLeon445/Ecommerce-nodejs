const express = require("express");
const Router = express.Router();
const {
  getProducts,
  createProducts,
  getAProduct,
  deleteAProduct,
  updateProducts,
  uplooadProductPhotos,
  ResizePhotoUpload,
} = require("../Controllers/productsController");
const { authProtect } = require("../Controllers/authConrollers");

Router.route("/").get(getProducts)
Router.route("/:ctgId").post(authProtect,uplooadProductPhotos,ResizePhotoUpload, createProducts)
Router.route("/:id").get(authProtect,getAProduct).patch(authProtect,uplooadProductPhotos,ResizePhotoUpload, updateProducts).delete(deleteAProduct);
module.exports = Router;
