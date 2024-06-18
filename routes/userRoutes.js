const express = require("express");
const user_route = express.Router(); // Use Router() to create a router instance

const auth = require("../middleware/authMiddleware")

const userController = require("../controller/userController");

const profileController = require("../controller/profileController");

const cartController = require("../controller/cartController");

const checkoutController = require("../controller/checkoutController");

const orderController = require("../controller/orderController")

// Define route using .get() method
user_route.get("/", userController.loadHomePage);
user_route.get("/signup",auth.isLogout,userController.loadSignUpPage);
user_route.post('/signup', userController.sendOtp);
user_route.get("/otpPage" , userController.loadotpPage);
user_route.post('/verifyOtp', userController.verifyOtp);
user_route.get('/otppage' ,userController.verifyOtp);
user_route.get("/login",userController.loadLoginPage); 
user_route.post('/resendOTP', userController.resendOTP);
user_route.post('/login',userController.verifyLogin)
 user_route.get('/logout',userController.userlogout)
user_route.get('/shopPage',userController.loadShopPage)
// user_route.get("/otpPage",userController.loadOtpPage);
// user_route.get('/singleproduct',userController.loadSinglePage)
user_route.get('/singleproduct', userController.getSingleProduct)
user_route.get('/profilePage',auth.isLogin,profileController.loadProfilePage)
user_route.post('/profile',profileController.editUserAndEmail)
user_route.post('/resetPassword',profileController.resetPassword)
user_route.get('/resetAddress',auth.isLogin,profileController.updateAdress)
user_route.post('/addaddress',profileController.addNewAddress)
user_route.delete('/deleteAddress/:id',profileController.deleteAddress)
user_route.put('/editAddress/:id',  profileController.editAddress);
user_route.get('/getCart',auth.isLogin,cartController.getCart)
user_route.post('/addCart',auth.isLogin,cartController.addToCart)
user_route.post('/remove-from-cart', cartController.removeFromCart);
user_route.post('/updatequantity',cartController.updateCartQuantity)
user_route.get('/checkoutPage',checkoutController.loadCheckoutPage);
// user_route.get('/checkout', checkoutController. getAddress);
user_route.put('/address/:id', checkoutController. updateAddress)
user_route.post("/addaddress/:id",checkoutController.addAddress)
user_route.get("/orderPage", orderController.loadOrderPage)
user_route.post("/checkavAvailability",checkoutController.checkAvailability)
module.exports = user_route;
