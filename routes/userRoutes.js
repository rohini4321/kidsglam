const express = require("express");
const user_route = express.Router(); // Use Router() to create a router instance

const auth = require("../middleware/authMiddleware")

const block  = require("../middleware/checkBlocked")

const userController = require("../controller/userController");

const profileController = require("../controller/profileController");

const cartController = require("../controller/cartController");

const checkoutController = require("../controller/checkoutController");

const orderController = require("../controller/orderController")

const forgotpasswordController =require("../controller/forgotpassController")

// Define route using .get() method
user_route.get("/", userController.loadHomePage);
user_route.get("/signup",auth.isLogout,userController.loadSignUpPage);
user_route.post('/signup',userController.sendOtp);
user_route.get("/otpPage" ,block.isBlocked, userController.loadotpPage);
user_route.post('/verifyOtp', userController.verifyOtp);
user_route.get('/otppage' ,auth.isLogout,block.isBlocked,userController.verifyOtp);
user_route.get("/login",auth.isLogout,block.isBlocked,userController.loadLoginPage); 
user_route.post('/resendOTP', userController.resendOTP);
user_route.post('/login',userController.verifyLogin)
 user_route.get('/logout',auth.isLogin,block.isBlocked,userController.userlogout)
user_route.get('/shopPage',auth.isLogin,block.isBlocked,userController.loadShopPage)
// user_route.get("/otpPage",userController.loadOtpPage);
// user_route.get('/singleproduct',userController.loadSinglePage)
user_route.get('/singleproduct',auth.isLogin,block.isBlocked, userController.getSingleProduct)
user_route.get('/profilePage',auth.isLogin,block.isBlocked,profileController.loadProfilePage)
user_route.post('/profile',profileController.editUserAndEmail)
user_route.post('/resetPassword',profileController.resetPassword)
user_route.get('/resetAddress',auth.isLogin,block.isBlocked,profileController.updateAdress)
user_route.post('/addaddress',profileController.addNewAddress)
user_route.delete('/deleteAddress/:id',profileController.deleteAddress)
user_route.put('/editAddress/:id',  profileController.editAddress);
user_route.get('/getCart',auth.isLogin,block.isBlocked,cartController.getCart)
user_route.post('/addCart',auth.isLogin,cartController.addToCart)
user_route.post('/remove-from-cart', cartController.removeFromCart);
user_route.post('/updatequantity',cartController.updateCartQuantity)
user_route.get('/checkoutPage',block.isBlocked,checkoutController.loadCheckoutPage);
// user_route.get('/checkout', checkoutController. getAddress);
user_route.put('/address/:id', checkoutController. updateAddress)
user_route.post("/addaddress/:id",checkoutController.addAddress)
user_route.get("/orderPage",block.isBlocked, orderController.loadOrderPage)
user_route.post("/checkStock",checkoutController.checkStock)
 user_route.post("/placeOrder",checkoutController.placeOrder)
user_route.post("/getCartDetails",checkoutController. getCartDetails)
user_route.get('/getAddressDetails/:id',block.isBlocked,checkoutController.getAddressDetails)
user_route.get('/viewDetail',block.isBlocked,orderController.viewDetails)
user_route.post('/cancelorder',orderController.cancelOrder)



// forgotpassword pages
user_route.get('/forgotpassword',block.isBlocked,forgotpasswordController.getForgotPassword)
user_route.post('/forgotpassword',forgotpasswordController.sendmail)
user_route.get('/enterOtp',block.isBlocked,forgotpasswordController.enterOtp)
user_route.post('/enterOtp',forgotpasswordController.verifyOtp)
user_route.get('/resetpassword',block.isBlocked,forgotpasswordController.loadResetPassword )
user_route.post('/fpResendOtp',forgotpasswordController.fpResendOtp)

user_route.post('/newpassword',forgotpasswordController.newPassword)
module.exports = user_route;
