const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
   password: {
      type: String,
   },
    
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    profilePic: { type: String, default: "/uploads/default-profile.png" }, // Default profile picture
  
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
  },
);

// ✅ Add Passport-Local Mongoose plugin
userSchema.plugin(plm, { usernameField: "username" });

const User = mongoose.model("User", userSchema);
module.exports = User;
