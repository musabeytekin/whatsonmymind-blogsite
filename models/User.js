const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Blog = require("./Blog");
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    select: false,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: String,
  about: String,
  website: String,
  place: String,
  profile_image: {
    type: String,
    default: "default.png",
  },
  blocked: {
    type: Boolean,
    default: false,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

UserSchema.methods.getToken = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

  const payload = {
    id: this._id,
    name: this.name,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  });

  return token;
};

UserSchema.methods.getResetPasswordToken = function () {
  const rs = crypto.randomBytes(20).toString("hex");

  const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(rs)
    .digest("hex");

  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpire =
    Date.now() + parseInt(process.env.RESET_PASSWORD_EXPIRE);

  return resetPasswordToken;
};

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);
      this.password = hash;
      return next();
    });
  });
});

UserSchema.post("remove", async function () {
  const result = await Blog.deleteMany({ user: this._id });
});

module.exports = mongoose.model("User", UserSchema);
