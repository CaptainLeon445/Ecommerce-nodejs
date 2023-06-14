const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")


const userSchema=mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Duplicate username is not accepted"],
        trim: true,
        minLength: [4, "Username must contain minimum of four characters"],
        required: [true, "Kindly supply your username"],
    },
    email: {
        type: String,
        unique: [true, "Duplicate email is not accepted"],
        trim: true,
        validate: [validator.isEmail, "Provide valid email details"],
        required: [true, "Kindly supply your user email"], 
        lowercase: true
    },
    password: {
        type: String,
        minLength: [8, "password must contain minimum of four characters"],
        required: [true, "Kindly supply your user passwaord"],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Kindly confirm your user passwaord"],
        validate:{
            validator: function(el){
                return el === this.password
            },
            message: "Passwords are not matched!"
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    roles:{
        type: String,
        enum: ["admin","staff", "user"],
        default: "user"
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    }
    
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password, 12)
    this.passwordConfirm=undefined;
    next()
})
userSchema.methods.comparePassword=async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)

}

const User=mongoose.model("Users", userSchema)
module.exports=User;