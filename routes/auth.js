const express = require("express");
const router = express.Router();
const {register, login, logout, imageUpload, forgotPassword, resetPassword, updateDetails} = require("../controllers/auth");
const photoUpload = require("../helpers/libraries/multer");
const {isLoggedIn} = require("../middlewares/authorization/auth")

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isLoggedIn, logout);
router.put("/upload", [isLoggedIn, photoUpload.single("profile_image")], imageUpload);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/update", isLoggedIn, updateDetails);

module.exports = router;