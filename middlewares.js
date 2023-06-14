const express=require("express");
const session = require('express-session');
const morgan=require("morgan")
const app=express()

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));


app.use(express.json())
app.use(morgan("dev"))
app.use((req, res, next)=>{
    console.log("Welcome to my Ecommorce Middlware 🥫")
    next();
})


module.exports=app;