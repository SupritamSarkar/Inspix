https://sspinterest.onrender.com


## **Pinterest Clone**

A Pinterest-like application built with **Node.js**, **Express**, **MongoDB**, and **EJS**. This app allows users to upload, save, and share images while providing features like user authentication, post creation, and dynamic image galleries.

---

### **Introduction**
This project is a clone of Pinterest, a popular image-sharing social media service. It allows users to:
- Upload and share images.
- View post details.
- Like and comment on posts.
- Manage profiles.

Built using **Node.js** for the backend, **MongoDB Atlas** for the database, and **EJS** for rendering views.

---

### **Features**
- User authentication and session management (using Passport.js).
- Upload and display images dynamically.
- Commenting and liking posts.
- Post management (create, view, delete).
- design with EJS templates.

---

### **Technologies Used**
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Passport.js
- **Templating Engine**: EJS
- **File Uploads**: Multer
- **Session Storage**: connect-mongo
- **Styling**: CSS

---

### **Installation**

#### Prerequisites:
1. Install [Node.js](https://nodejs.org/).
2. Set up a MongoDB Atlas cluster or use a local MongoDB instance.

#### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-github-username>/<repository-name>.git
   cd <repository-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
     ```

4. Start the application:
   ```
  npm start
   ```

5. Visit the app at

https://sspinterest.onrender.com

---

### **Usage**
1. Register a new account or log in with an existing account.
2. Upload images to your profile.
3. View post details, like posts, and add comments.
4. Manage your profile.

---

