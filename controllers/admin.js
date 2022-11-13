const errorWrapper = require("../helpers/errors/errorWrapper");
const { findById } = require("../models/Blog");
const User = require("../models/User");
const block = errorWrapper(async(req, res, next) => {
    const {id} = req.params;
    
    
    const user = await User.findByIdAndUpdate(id, {blocked: true}, {
        new: true,
        runValidators: true
    })

    return res
    .status(200)
    .json({
        success: true,
        message: "user has been blocked",
        data: user
    });

});

const unBlock = errorWrapper(async(req, res, next) => {
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(id, {blocked: false}, {
        new: true,
        runValidators: true
    })

    return res
    .status(200)
    .json({
        success: true,
        message: "user has been unblocked",
        data: user
    });

});

const deleteUser = errorWrapper(async (req, res, next) => {
    const {id} = req.params;

    // const user = await User.findByIdAndDelete(id, {
    //     new: true
    // });
    const user = await User.findById(id);
    await user.remove();
    return res
    .status(200)
    .json({
        succes: true,
        message: "user has been deleted",
        data: user
    });
})

module.exports = {
    block,
    unBlock,
    deleteUser
}