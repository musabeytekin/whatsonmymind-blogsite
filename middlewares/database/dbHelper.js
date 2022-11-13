const CustomError = require("../../helpers/errors/CustomError");
const errorWrapper = require("../../helpers/errors/errorWrapper");
const Blog = require("../../models/Blog");
const User = require("../../models/User");

const checkUserExist = errorWrapper(async (req, res, next) => {
  const id = req.params.id;

  const user = User.findById(id);

  if (!user)
    return next(new CustomError(`user not found with that id (${id})`));

  return next();
});

const checkBlogExist = errorWrapper(async (req, res, next) => {
  const blog = Blog.findById(req.params.id);
  if (!blog)
    return next(
      new CustomError(`blog not found with that id (${req.params.id})`)
    );
  return next();
});

module.exports = {
  checkUserExist,
  checkBlogExist
};
