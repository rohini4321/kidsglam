const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/kidsglam");
const path = require('path')
const nocache = require("nocache");
const express = require("express");
const session = require('express-session');
const app = express(); // Create an instance of express
app.use(nocache())
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_very_strong_secret_key_here',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto', // Set to 'true' for HTTPS only
            maxAge: 1000 * 60 * 15, // Set session expiration to 15 minutes
            httpOnly: true }    // Prevent client-side JavaScript access
}));



app.use(express.json());
app.use(express.urlencoded({extended: true}))

require('dotenv').config();


// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views/user"),
  path.join(__dirname, "views/admin"),  
]);

app.use(express.static(path.join(__dirname,'public')));
// for user routes
const userRoute = require('./routes/userRoutes');
app.use('/', userRoute);

// for admin routes
 const adminRoute = require('./routes/adminRoute');
 app.use('/admin', adminRoute);

app.listen(4000, () => console.log("Server is running...."));


// Configure session middleware with strong security considerations(creating session)


// ... rest of your app code