const express = require("express");
const Router = express.Router();
const {
  getCategories,
  createCategories,
  getAcategory,
  updateCategories,
  deleteAcategory,
} = require("../Controllers/categoriesController");

Router.route("/").get(getCategories).post(createCategories);
Router.route("/:id")
  .get(getAcategory)
  .patch(updateCategories)
  .delete(deleteAcategory);
module.exports = Router;
