require('dotenv').config(); // Load environment variables

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const indexRouter = require('./routes/index');
const User = require('./models/users');

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB connected");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});



// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Session with MongoStore (recommended for production)
app.use(session({
  secret: 'iuhoihiuh',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// ✅ Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use('/', indexRouter);

app.get('/login', (req, res) => {
  res.render('login'); // renders views/login.ejs
});


// 404 Handler
app.use((req, res, next) => {
  next(createError(404));
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Mongoose event logging (optional but helpful)
mongoose.connection.on("connected", () => {
  console.log(`✅ Mongoose connected to ${mongoose.connection.host}`);
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

module.exports = app;
