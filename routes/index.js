const express = require("express");
const auth = require("./auth");
const user = require("./user");
const admin = require("./admin");
const blog = require("./blog");
const router = express.Router();

router.use("/auth", auth);
router.use("/users",user);
router.use("/admin", admin);
router.use("/blogs", blog)

module.exports = router;