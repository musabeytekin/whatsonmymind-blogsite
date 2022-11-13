const express = require("express");
const { block, unBlock, deleteUser } = require("../controllers/admin");
const { getAdminAccess, isLoggedIn } = require("../middlewares/authorization/auth");

const router = express.Router();

router.use([isLoggedIn, getAdminAccess]);
router.get("/", (req, res, next) => {
    res.json({
        success: true,
        message: "admin page"
    });
});

router.put("/block/:id", block);
router.put("/unblock/:id", unBlock);
router.delete("/delete/:id", deleteUser);
module.exports = router;