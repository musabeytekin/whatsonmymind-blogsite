const express = require("express");
const {
  getBlog,
  addBlog,
  editBlog,
  deleteBlog,
  likeBlog,
  undoLikeBlog,
} = require("../controllers/Blog");
const {
  isLoggedIn,
  getBlogOwnerAccess,
} = require("../middlewares/authorization/auth");
const { checkBlogExist } = require("../middlewares/database/dbHelper");
const { blogQuery } = require("../middlewares/query/blogQuery");
const Blog = require("../models/Blog");
const router = express.Router();

router.get(
  "/",
  blogQuery(Blog, {
    population: {
      path: "user",
      select: "name profile_image",
    },
  }),
  getBlog
);

router.get(
  "/:id",
  checkBlogExist,
  blogQuery(Blog, {
    population: {
      path: "user",
      select: "name profile_image",
    },
  }),
  getBlog 
);
router.post("/add", isLoggedIn, addBlog);
router.put(
  "/edit/:id",
  [isLoggedIn, checkBlogExist, getBlogOwnerAccess],
  editBlog
);
router.delete(
  "/:id/delete",
  [isLoggedIn, checkBlogExist, getBlogOwnerAccess],
  deleteBlog
);
router.get("/:id/like", [isLoggedIn, checkBlogExist], likeBlog);
router.get("/:id/undoLike", [isLoggedIn, checkBlogExist], undoLikeBlog);

// router.get("/:id", )
module.exports = router;
