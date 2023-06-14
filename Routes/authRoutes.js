const express=require("express")
const Router=express.Router()
const { signUp, login }=require("../Controllers/authConrollers")

Router.route("/register").post(signUp)
Router.route("/login").post(login)

module.exports=Router;