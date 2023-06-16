const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
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
    lowercase: true,
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
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not matched!",
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  roles: {
    type: String,
    enum: ["admin", "staff", "user"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.passwordChangedAfter = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const timestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTtimestamp < timestamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function (JWTtimestamp) {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("Users", userSchema);
module.exports = User;
