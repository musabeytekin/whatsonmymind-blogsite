const CustomError = require("../helpers/errors/CustomError");
const errorWrapper = require("../helpers/errors/errorWrapper");
const User = require("../models/User");

const getUserById = errorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    return res
        .status(200)
        .json({
            success: true,
            data: user
        });
});

const getAllUsers = errorWrapper(async (req, res, next) => {
    const users = await User.find()

    return res
        .status(200)
        .json({
            success: true,
            data: users
        });
})

module.exports = {
    getUserById,
    getAllUsers
}
