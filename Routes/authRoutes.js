const express = require("express");
const Router = express.Router();
const {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    authProtect,
    updatePassword,
    updateMe,
    deleteMe,
  } = require("../Controllers/authConrollers");

Router.route("/register").post(signUp);
Router.route("/login").post(login);
Router.route("/forgotPassword").post(forgotPassword);
Router.route("/resetPassword/:token").post(resetPassword);
Router.route("/updatePassword").patch(authProtect, updatePassword);
Router.route("/updateMe").patch(authProtect, updateMe);
Router.route("/deleteMe").patch(authProtect, deleteMe);

module.exports = Router;
