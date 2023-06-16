const express = require("express");
const Router = express.Router();
const {
  getProducts,
  createProducts,
  getAProduct,
  deleteAProduct,
  updateProducts,
  uploadProductPhotos,
  ResizePhotoUpload,
} = require("../Controllers/productsController");
const { authProtect, restrictTo } = require("../Controllers/authConrollers");

Router.route("/").get(getProducts)
Router.route("/:ctgId").post(authProtect,restrictTo("admin"),uploadProductPhotos,ResizePhotoUpload, createProducts)
Router.route("/:id").get(authProtect,getAProduct).patch(authProtect,restrictTo("admin"),uploadProductPhotos,ResizePhotoUpload, updateProducts).delete(deleteAProduct);
module.exports = Router;
