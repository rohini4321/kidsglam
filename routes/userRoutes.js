const express = require("express");
const user_route = express.Router(); // Use Router() to create a router instance



const userController = require("../controller/userController");

// Define route using .get() method
user_route.get("/", userController.loadHomePage);
user_route.get("/signup",userController.loadSignUpPage);
user_route.post('/signup', userController.loadOtpPage);
user_route.get("/otpPage" , userController.loadotp);
user_route.post('/verifyOtp', userController.verifyOtp);
user_route.get('/otppage' , userController.verifyOtp);
user_route.get("/login",userController.loadLoginPage);
user_route.post('/resendOTP', userController.resendOTP);
user_route.post('/login',userController.verifyLogin)
 user_route.get('/logout',userController.userlogout)

// user_route.get("/otpPage",userController.loadOtpPage);
module.exports = user_route;
