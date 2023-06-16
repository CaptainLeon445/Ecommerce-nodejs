const express = require("express");
const Router = express.Router();
const {
  getCategories,
  createCategories,
  getAcategory,
  updateCategories,
  deleteAcategory,
} = require("../Controllers/categoriesController");
const { authProtect, restrictTo } = require("../Controllers/authConrollers");

Router.route("/").get(getCategories).post(authProtect,restrictTo("admin"),createCategories);
Router.use(authProtect,restrictTo("admin"))
Router.route("/:id")
  .get(getAcategory)
  .patch(updateCategories)
  .delete(deleteAcategory);
module.exports = Router;
