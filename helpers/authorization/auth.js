const bcrypt = require("bcryptjs");
const sendToken = (user, res, status) => {
    const token = user.getToken();
    const { JWT_COOKIE_EXPIRE, NODE_ENV } = process.env;

    return res
        .status(status)
        .cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + parseInt(JWT_COOKIE_EXPIRE) * 1000 * 2 * 60),
            secure: NODE_ENV === "development" ? false : true
        })
        .json({
            success: true,
            token,
            data: {
                name: user.name,
                role: user.role
            }
        });
}

const isTokenIncluded = (req) => {
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer:");
}

const getTokenFromHeader = (req) => {
    return req.headers.authorization.split(" ")[1];
}

const validateUserInputs = (email, password) => email && password;

const checkPassword = (password,hashedPassword) => bcrypt.compareSync(password, hashedPassword);



module.exports = {
    sendToken,
    isTokenIncluded,
    getTokenFromHeader,
    validateUserInputs,
    checkPassword
};