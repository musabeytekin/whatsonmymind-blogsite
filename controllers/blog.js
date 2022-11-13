const errorWrapper = require("../helpers/errors/errorWrapper");
const Blog = require("../models/Blog");
const CustomError = require("../helpers/errors/CustomError");
const addBlog = errorWrapper(async (req, res, next) => {
  const blog = await Blog.create({
    ...req.body,
    user: req.user.id,
  });
  console.log(blog.likeCount)
  return res.status(200).json({
    success: true,
    data: blog,
  });
});

// const getBlog = errorWrapper(async (req, res, next) => {

// })

const getBlog = errorWrapper(async (req, res, next) => {
  // const blogs = await Blog.find();
  // return res.status(200).json({
  //   success: true,
  //   data: blogs,
  // });

  return res.status(200).json(res.result);
});

const editBlog = errorWrapper(async (req, res, next) => {
  const id = req.params.id;
  const { title, content } = req.body;

  const blog = await Blog.findByIdAndUpdate(
    id,
    {
      title,
      content,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    data: blog,
  });
});

const deleteBlog = errorWrapper(async (req, res, next) => {
  const id = req.params.id;
  await Blog.findById(id).remove();
  // await Blog.findByIdAndRemove(id);

  return res.status(200).json({
    success: true,
    message: "delete successful",
  });
});

const likeBlog = errorWrapper(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (blog.likes.includes(req.user.id))
    return next(new CustomError("you already liked this post"));
  
  blog.likes.push(req.user.id);
  blog.likeCount += 1;
  await blog.save();

  return res
  .status(200)
  .json({
    success: true,
    data: blog
  });
});
const undoLikeBlog = errorWrapper(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog.likes.includes(req.user.id))
    return next(new CustomError("you not liked this post"));
  
  const index = blog.likes.indexOf(req.user.id);
  blog.likes.splice(index, 1);
  blog.likeCount -= 1;
  await blog.save();

  return res
  .status(200)
  .json({
    success: true,
    data: blog
  });
});
// const getBlogById = errorWrapper(async (req, res, next) => {
//     const id = req.params.id;

//     const blog = await Blog.findById()
// });

module.exports = {
  addBlog,
  getBlog,
  editBlog,
  deleteBlog,
  likeBlog,
  undoLikeBlog
};
