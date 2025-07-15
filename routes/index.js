const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const https = require("https");
const fs = require("fs");

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

// 📖 View Post Detail(for owner can delete the post)
router.get("/post/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id)
      .populate("user")
      .populate("comments.user");

    if (!post) return res.status(404).send("Post not found");

    // 🔒 Check if logged-in user is the owner
    if (!req.user || post.user._id.toString() !== req.user._id.toString()) {
      // Redirect non-owners to read-only version
      return res.redirect(`/postDetailAll/${post._id}`);
    }

    // Owner: render editable postDetails
    res.render("postDetails", {
      post,
      user: req.user, // Pass logged-in user
    });
  } catch (error) {
    console.error("Error fetching post details:", error);
    res.status(500).send("Error loading post details");
  }
});



// 🔍 View Post Details with All Comments(can't delete)
router.get("/postDetailAll/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id).populate("user").populate("comments.user");
    if (!post) return res.status(404).send("Post not found");
    res.render("postDetailAll", { post,
      user: req.user
     });
  } catch (err) {
    console.error("❌ Post Detail Error:", err);
    res.status(500).send("Error loading post");
  }
});

// Follow user
router.post("/follow/:id", isLoggedIn, async (req, res) => {
  const userToFollow = await userModel.findById(req.params.id);
  const currentUser = await userModel.findById(req.user._id);

  if (!userToFollow.followers.includes(req.user._id)) {
    userToFollow.followers.push(req.user._id);
    currentUser.following.push(userToFollow._id);
    await userToFollow.save();
    await currentUser.save();
  }

  res.redirect(`/user/${userToFollow._id}`);
});

// Unfollow user
router.post("/unfollow/:id", isLoggedIn, async (req, res) => {
  const userToUnfollow = await userModel.findById(req.params.id);
  const currentUser = await userModel.findById(req.user._id);

  userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user._id.toString());
  currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow._id.toString());

  await userToUnfollow.save();
  await currentUser.save();

  res.redirect(`/user/${userToUnfollow._id}`);
});

// View user profile
router.get("/user/:id", async (req, res) => {
  try {
    const profileUser = await userModel
      .findById(req.params.id)
      .populate("posts");

    const isOwnProfile = req.user && req.user._id.toString() === req.params.id;
    const isFollowing = req.user
      ? profileUser.followers.includes(req.user._id)
      : false;

    res.render("userProfile", {
      userdata: profileUser,
      isOwnProfile,
      isFollowing,
    });
  } catch (err) {
    console.error("Error loading user profile:", err);
    res.status(500).send("Error loading profile");
  }
});

// 👤 View Followers List
router.get('/user/:id/followers', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).populate('followers');
    if (!user) return res.status(404).send("User not found");

    res.render('followers', { users: user.followers, title: `${user.username}'s Followers` });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).send("Server error");
  }
});

// 👥 View Following List
router.get('/user/:id/following', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).populate('following');
    if (!user) return res.status(404).send("User not found");

    res.render('following', { users: user.following, title: `${user.username} is Following` });
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).send("Server error");
  }
});


// 🗑️ Delete Comment
router.delete('/delete-comment/:postId/:commentId', isLoggedIn, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ success: false });

    // Find the comment
    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    // Check ownership
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Remove comment by filtering
    post.comments = post.comments.filter(c => c._id.toString() !== commentId);

    await post.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// 🗑️ Delete Account
router.post("/delete-account", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Delete all user's posts (and remove from Cloudinary if needed)
    const posts = await postModel.find({ user: userId });
    for (let post of posts) {
      if (post.imagePublicId) {
        await cloudinary.uploader.destroy(post.imagePublicId);
      }
      await postModel.findByIdAndDelete(post._id);
    }

    // 2. Remove this user from followers and following
    await userModel.updateMany({ followers: userId }, { $pull: { followers: userId } });
    await userModel.updateMany({ following: userId }, { $pull: { following: userId } });

    // 3. Remove all likes by this user
    await postModel.updateMany({}, { $pull: { likes: userId } });

    // 4. Remove all comments made by this user
    await postModel.updateMany({}, { $pull: { comments: { user: userId } } });

    // 5. Delete the user itself
    await userModel.findByIdAndDelete(userId);

    // 6. Logout and destroy session
    req.logout(err => {
      if (err) return res.status(500).send("Logout failed");
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/");
      });
    });
  } catch (err) {
    console.error("❌ Error deleting account:", err);
    res.status(500).send("Server error during account deletion");
  }
});



// Download image route
router.post("/download-image/:postId", isLoggedIn, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.postId);
    if (!post) return res.status(404).send("Post not found");

    const imageUrl = post.imageUrl;
    const filename = `download-${Date.now()}.jpg`;
    const tempPath = path.join(__dirname, "..", "temp", filename);

    // Create temp dir if not exists
    fs.mkdirSync(path.join(__dirname, "..", "temp"), { recursive: true });

    const file = fs.createWriteStream(tempPath);
    https.get(imageUrl, response => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => {
          res.download(tempPath, filename, err => {
            fs.unlink(tempPath, () => {}); // Clean up after sending
            if (err) console.error("Download error:", err);
          });
        });
      });
    }).on("error", err => {
      console.error("Image download failed:", err);
      fs.unlink(tempPath, () => {});
      res.status(500).send("Download failed");
    });
  } catch (err) {
    console.error("Download route error:", err);
    res.status(500).send("Server error");
  }
});




// 🔐 Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
