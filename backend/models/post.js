const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    postText: {
        type: String,
        default: ""
    }, // Post content

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Reference to the user who created the post

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store likes
    
    comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],

    createdAt: {
        type: Date,
        default: Date.now
    }, // Auto-assign current date & time
    
    imageUrl: { type: String, required: true }, // Image URL

    imagePublicId: { type: String, required: true } // Public ID for Cloudinary
});

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
