const User = require("../models/User");
const errorWrapper = require("../helpers/errors/errorWrapper");
const {
  sendToken,
  validateUserInputs,
  checkPassword,
} = require("../helpers/authorization/auth");
const CustomError = require("../helpers/errors/CustomError");
const photoUpload = require("../helpers/libraries/multer");
const resetPasswordEmailTemplate = require("../helpers/libraries/templates/resetPasswordEmail");
const sendMail = require("../helpers/libraries/mailSender");

const register = errorWrapper(async (req, res, next) => {
  const { name, email, password} = req.body;

  const user = await User.create({
    name,
    email,
    password
  });

  sendToken(user, res, 200);
});

const login = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  //kullanıcı gerekli alanları boş geçti ise

  if (!validateUserInputs(email, password))
    return next(new CustomError("Check your Inputs", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !checkPassword(password, user.password))
    return next(new CustomError("please check your credentials", 404));

  sendToken(user, res, 200);
});

const logout = errorWrapper(async (req, res, next) => {
  // console.log(req);
  const { NODE_ENV } = process.env;

  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Succesfull",
    });
});

const imageUpload = errorWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profile_image: req.savedImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({
    success: true,
    message: "Photo Upload Successfull",
  });
});

const forgotPassword = errorWrapper(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email });

  if (!user) return next(new CustomError("User not found", 400));

  const resetPasswordToken = user.getResetPasswordToken();

  await user.save();

  const resetPasswordUrl = `http://localhost:3000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate = resetPasswordEmailTemplate(resetPasswordUrl);

  try {
    await sendMail({
      from: process.env.EMAIL_ADDR,
      to: email,
      subject: "What's on my mind - RESET PASSWORD",
      html: emailTemplate,
    });

    return res.status(200).json({
      success: true,
      message: "email sent",
      data: user,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new CustomError("Email could not be sent", 500));
  }
});

const resetPassword = errorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;

  if (!resetPasswordToken)
    return next(new CustomError("your token is invalid", 400));
  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return next(new CustomError("invalid token or session expired", 404));

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "password change successful",
  });
});

const updateDetails = errorWrapper(async (req, res, next) => {
  const thingsToUpdate = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, thingsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "details updated",
    data: user,
  });
});
module.exports = {
  register,
  login,
  logout,
  imageUpload,
  forgotPassword,
  resetPassword,
  updateDetails,
};
