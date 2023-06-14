const User=require("../Model/userModel")
const jwtToken=require("../utils/generateJWToken")

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
                err: "Credentials not found in the database"
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