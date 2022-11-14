const express = require("express");
const router = express.Router();
const {register, login, logout, imageUpload, forgotPassword, resetPassword, updateDetails} = require("../controllers/auth");
const photoUpload = require("../helpers/libraries/multer");
const {isLoggedIn} = require("../middlewares/authorization/auth");
const limitAccess = require("../middlewares/security/limitAccess");

router.post("/register", register);
router.post("/login", limitAccess({
    windowMs:60* 1000,  //1 minute
    max: 5,
    message: "Too much login attempt, please try again after  1 minutes"
}) ,login);
router.get("/logout", isLoggedIn, logout);
router.put("/upload", [isLoggedIn, photoUpload.single("profile_image")], imageUpload);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/update", isLoggedIn, updateDetails);

module.exports = router;