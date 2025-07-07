const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const path = require("path");

const userModel = require("../models/users");
const postModel = require("../models/post");
const { cloudinary, storage } = require("../utils/cloudinary");
const upload = multer({ storage });

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

// 🔐 Force fresh user on each request
router.use(async function (req, res, next) {
  if (req.isAuthenticated()) {
    try {
      req.user = await userModel.findById(req.user._id);
    } catch (e) {
      console.error("❌ Failed to refresh session user:", e);
    }
  }
  next();
});

// 🏠 Register Page
router.get("/", (req, res) => {
  res.render("register");
});

// 🔑 Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// 🔐 Profile Page
router.get("/profile", async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const userPosts = await postModel.find({ _id: { $in: req.user.posts } });
    res.render("profile", { userdata: req.user, posts: userPosts || [] });
  } catch (err) {
    console.error("❌ Profile Page Error:", err);
    res.status(500).send(`<pre>${err.stack}</pre>`);
  }
});

// 🌍 Feed Page
router.get("/home", async (req, res) => {
  try {
    const posts = await postModel.find().populate("user");
    res.render("home", { posts });
  } catch (err) {
    console.error("❌ Home Page Error:", err);
    res.status(500).send("Error loading feed");
  }
});

// 📝 Register User
router.post("/register", async (req, res) => {
  const userdata = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.fullName,
    profilePic: "/uploads/default-profile.png",
  });

  await userModel.register(userdata, req.body.password);
  passport.authenticate("local")(req, res, () => res.redirect("/profile"));
});

// 🔓 Login User
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

// 🚪 Logout
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(err => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
});

// 📸 Update Profile Picture
router.post("/update-profile-pic", isLoggedIn, upload.single("profilePic"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded." });

    const imageUrl = req.file.path;

    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { profilePic: imageUrl },
      { new: true }
    );

    req.login(user, function (err) {
      if (err) return next(err);
      res.json({ success: true, profilePic: user.profilePic });
    });
  } catch (err) {
    console.error("❌ Profile pic upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// 🖼️ Upload New Post
router.post("/upload-post", isLoggedIn, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded." });

    const newPost = await postModel.create({
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
      postText: req.body.postText || "",
      user: req.user._id,
    });

    await userModel.findByIdAndUpdate(req.user._id, {
      $push: { posts: newPost._id },
    });

    res.json({ success: true, imageUrl: newPost.imageUrl, postId: newPost._id });
  } catch (err) {
    console.error("❌ Upload Post Error:", err);
    res.status(500).json({ success: false });
  }
});

// 🗑️ Delete Post
router.delete("/delete-post/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false });

    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await userModel.findByIdAndUpdate(post.user, { $pull: { posts: post._id } });
    await postModel.findByIdAndDelete(post._id);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete Post Error:", err);
    res.status(500).json({ success: false });
  }
});

// ❤️ Like or Unlike Post
router.post("/like/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false });

    const userId = req.user._id.toString();

    if (post.likes.map(id => id.toString()).includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ success: true, likes: post.likes.length });
  } catch (err) {
    console.error("❌ Like Error:", err);
    res.status(500).json({ success: false });
  }
});

// 💬 Add Comment
router.post("/comment/:postId", isLoggedIn, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false });

    post.comments.push({
      user: req.user._id,
      username: req.user.username,
      text: req.body.text,
    });

    await post.save();
    res.json({ success: true, username: req.user.username, text: req.body.text });
  } catch (err) {
    console.error("❌ Comment Error:", err);
    res.status(500).json({ success: false });
  }
});

// 🔍 View Single Post
router.get("/post/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id).populate("user").populate("comments.user");
    if (!post) return res.status(404).send("Post not found");
    res.render("postDetails", { post });
  } catch (err) {
    console.error("❌ Post Detail Error:", err);
    res.status(500).send("Error loading post");
  }
});

router.get("/postDetailAll/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id).populate("user").populate("comments.user");
    if (!post) return res.status(404).send("Post not found");
    res.render("postDetailAll", { post });
  } catch (err) {
    console.error("❌ Post Detail Error:", err);
    res.status(500).send("Error loading post");
  }
});

// 🔐 Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
