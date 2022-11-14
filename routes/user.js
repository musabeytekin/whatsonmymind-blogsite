const express = require("express");
const { getUser } = require("../controllers/user");
const { checkUserExist } = require("../middlewares/database/dbHelper");
const { userQuery } = require("../middlewares/query/userQuery");
const User = require("../models/User");
const router = express.Router();

router.get("/:id", checkUserExist, userQuery(User), getUser);
router.get("/", checkUserExist, userQuery(User), getUser);

module.exports = router;
