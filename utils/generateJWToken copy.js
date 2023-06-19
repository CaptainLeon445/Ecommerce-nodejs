const jwt=require("jsonwebtoken")

const jwtToken=function(id){
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
module.exports=jwtToken;