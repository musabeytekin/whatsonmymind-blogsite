const jwt = require("jsonwebtoken");
const { isTokenIncluded, getTokenFromHeader } = require("../../helpers/authorization/auth");
const CustomError = require("../../helpers/errors/CustomError");
const errorWrapper = require("../../helpers/errors/errorWrapper");
const Blog = require("../../models/Blog");
const User = require("../../models/User");

const isLoggedIn = errorWrapper(async (req, res, next) => {
    // console.log(req.headers)
    if(!isTokenIncluded(req)){
        return next(new CustomError("You are not authorized to access this page", 403));
    }

    const token = getTokenFromHeader(req);

    // console.log(`token ${token}`);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if(err) return next(new CustomError("you are not authorized to access this page", 401));

        req.user = {
            id: decodedToken.id,
            name: decodedToken.name
        };
        return next();
    });
});

const getAdminAccess = errorWrapper(async (req, res, next) => {
    const id = req.user.id;
    const user = await User.findById(id);

    if(user.role != "admin") return next(new CustomError("you have not access this route"), 403);

    return next();

});

const getBlogOwnerAccess = errorWrapper (async (req, res, next) => {
    const blog_id = req.params.id;
    const user_id = req.user.id;

    const blog = await Blog.findById(blog_id);
    if(blog.user != user_id) return next(new CustomError("only owner can edit this blog"));
    return next();
})

module.exports = {
    isLoggedIn,
    getAdminAccess,
    getBlogOwnerAccess
}