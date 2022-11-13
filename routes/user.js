const express = require("express");
const { getUserById, getAllUsers } = require("../controllers/user");
const { checkUserExist } = require("../middlewares/database/dbHelper");
const router = express.Router();

router.get("/:id", checkUserExist, getUserById);
router.get("/", getAllUsers);

module.exports = router;