const CustomError = require("../../helpers/errors/CustomError")

const errorHandler = (err, req, res, next) => {
    console.log(err)
    let customError = new CustomError(err.message, err.status);
    
    if (err.name === "SyntaxError") customError = new CustomError("unexpected syntax", 400);
    if (err.name === "ValidationError") customError = new CustomError(err.message, 400);

    return res.status(customError.status || 500).json({
        success: false,
        message: customError.message || "Internal Server Error"
    })
}

module.exports = errorHandler;