const CustomError = require("../helpers/errors/CustomError");
const errorWrapper = require("../helpers/errors/errorWrapper");
const User = require("../models/User");


const getUser = errorWrapper(async (req, res, next) => {
    return res
        .status(200)
        .json(res.result)
})

module.exports = {
    getUser
}
