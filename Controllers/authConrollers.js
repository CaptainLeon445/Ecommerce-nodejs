const User=require("../Model/userModel")
const jwtToken=require("../utils/generateJWToken")
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const mongoose  = require("mongoose");

exports.signUp=async (req, res)=>{
    try{
        const data={
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        }
        const newUser=await User.create(data)
        const token=jwtToken(newUser._id)
        res.status(200).json({
            message:"success",
            token,
            data: newUser
        })
    }catch(err){
        res.status(400).json({
            message:"fail",
            err: err.message
        })
    }
}

exports.login=async (req, res)=>{
    try{
        const {email, password}=req.body; 
        if (!email || !password){
            return res.status(400).json({
                message:"fail",
                err: "Fields cannot be blank"
            })
        }
        const user=await User.findOne({email}).select("+password")
        if (!user || !(await user.comparePassword(password, user.password))){
            return  res.status(400).json({
                message:"fail",
                err: "Email or Password incorrect."
            })
        }
        const token=jwtToken(user._id)
        res.status(200).json({
            message:"success",
            token
        })
    }catch(err){
        res.status(400).json({
            message:"fail",
            err: err.message
        })
    }
}

exports.authProtect = async (req, res, next) => {
    let token;
    // check if there is authorization token
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      res.status(400).json({
        message: "fail",
        err: "No token",
      });
    }
    // decode the token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );
    const user = await User.findById(decoded.id);
  
    // verify the token
    if (!user) {
      return res.status(403).send("Unauthorized");
    }
    if (user.passwordChangedAfter(decoded.iat)) {
      return res
        .status(401)
        .send("Password has been changed since when you last logged in");
    }
  
    // gain access with the token
    req.user = user;
    next();
  };
  
exports.restrictTo = (...roles) =>{
    return (req, res, next) => {
      if (!roles.includes(req.user.roles)){
        throw new Error ("You do not have permission to perform this action.")
      }
      next();
    };
  } 
   
exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: "fail",
          err: "Email not found in th database",
        });
      }
      const resetToken = user.createPasswordResetToken();
      user.save({ validateBeforeSave: false });
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/v1/api/auth/resetPassword/${resetToken}`;
      const message=`Hi ${user.username},  \n \n Your password reset token is sent and it is valid only for 10min. If you didn't request for this, kindly ignore. Reset your password via this link: ${resetUrl}`
      try{ 
          await sendEmail({
              email: user.email,
              subject:"Momento: Password Reset",
              message
          })
          res.status(200).json({
            message: "Token sent to your email!",
          });
      }catch (err) {
          user.passwordResetToken=undefined;
          user. passwordResetExpires=undefined;
          user.save({ validateBeforeSave: false})
          res.status(400).json({
            message: "fail",
            err: err.message,
          });
        }
    } catch (err) {
      res.status(400).json({
        message: "fail",
        err: err.message,
      });
    }
  };
  
exports.resetPassword = async (req, res) => {
    try {
      const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt : Date.now()}
      });
      if (!user) {
        return res.status(400).json({
          message: "fail",
          err: "Token is invalid or expired",
        });
      }
      user.password=req.body.password
      user.passwordConfirm=req.body.passwordConfirm
      user.passwordResetToken=undefined
      user.passwordResetExpires=undefined
      await user.save()
  
      const token = jwtToken(user._id);
      res.status(200).json({
        message: "success",
        token,
      });
    } catch (err) {
      res.status(400).json({
        message: "fail",
        err: err.message,
      });
    }
  };
  
exports.updatePassword = async (req, res) => {
    try {
      
      const user = await User.findOne(new mongoose.Types.ObjectId(req.user.id)).select("+password");
      if (!await user.comparePassword(req.body.myPassword, user.password)) {
        console.log("here")
        return res.status(401).json({
          message: "fail",
          err: "Invalid Password",
        });
      }
      user.password=req.body.password
      user.passwordConfirm=req.body.passwordConfirm
      await user.save()
  
      const token = jwtToken(user._id);
      res.status(200).json({
        message: "success",
        token,
        data: user,
      });
    } catch (err) {
      res.status(400).json({
        message: "fail",
        err: err.message,
      });
    }
  };
  
exports.updateMe = async (req, res) => {
    try {
      if (req.body.password || req.body.passwordConfirm){
        return res.status(400).json({
          message: "fail",
          err: "This route is not for changing user password",
        });
      }
      const filterBody = filterObj (req.body, "username", "email","address", "state", "Nationality")
      const user = await User.findByIdAndUpdate(new mongoose.Types.ObjectId(req.user.id), filterBody, {
        new: true,
        runValidators: true
      })
  
      res.status(200).json({
        message: "success",
        data: user,
      });
    } catch (err) {
      res.status(400).json({
        message: "fail",
        err: err.message,
      });
    }
  };
  
exports.deleteMe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(new mongoose.Types.ObjectId(req.user.id), {active : false})
    res.status(200).json({
      message: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      message: "fail",
      err: err.message,
    });
  }
  };