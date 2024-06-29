const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require("../models/userDataModel")
const Category = require("../models/categoryModel")
const Product = require("../models/productDataModel")


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD
  }
});

// Function to generate OTP
const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Function to hash password using bcrypt
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};


const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Function to send OTP via email
const sendMail = async (email, otp) => {
  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to: email,
    subject: 'Your OTP ',
    text: `Your OTP is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

// Function to load OTP page
const  sendOtp = async (req, res) => {
  try {
    const{username,email,phonenumber,password}=req.body;
    
    const user ={username,email,phonenumber:phonenumber, password}
    req.session.user= user;
    

    if (!email) {
      throw new Error('Email is missing in request body.');
    }

    const otp = generateOTP();
    console.log(otp);
    req.session.otp = otp;

    await sendMail(email, otp);


    res.redirect('/otpPage');
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).send(error.message);
  }
};



let resendTimer; 
const startResendTimer = () => {
  resendTimer = setTimeout(() => {
    const newOtp = generateOTP();
    console.log(newOtp);
    req.session.otp = newOtp;
    sendMail(email, newOtp);
  }, 60000);
};

// Function to resend OTP
const resendOTP = async (req, res) => {
  try {
    const {email}=req.session.user

    if (!email) {
      throw new Error('Email is missing in request body.');
    }

    const otp = generateOTP();
    req.session.otp = otp;
    await sendMail(email, otp);

    clearTimeout(resendTimer);
    startResendTimer();

    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(error.message);
  }
};

const verifyOtp = async (req, res) => {
  const enteredOtp =parseInt(req.body.enteredOtp);
  const storedOtp = parseInt(req.session.otp);
  console.log(`entered otp : ${enteredOtp} and stored otp : ${storedOtp}`)
  try {
    if (enteredOtp !== storedOtp) {
      throw new Error('Invalid OTP');
    }

    const userData = req.session.user;
    console.log(userData)
    const passwordHash = await hashPassword(userData.password);

    const saveUserData = new User({
      username: userData.username,
      email: userData.email,
      phonenumber:userData.phonenumber,
      password: passwordHash
    });

    await saveUserData.save();
    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('this Error:', error.message);
    res.status(500).send(error.message);
  }
};
  
const verifyLogin = async (req, res) => {
  try {
    const {email , password}=req.body;
    const findUser = await User.findOne({ isAdmin: "0", email: email });
 
  if (findUser) {
        const passwordMatch = await bcrypt.compare(password, findUser.password);
        if (passwordMatch) {
          req.session.user = findUser._id;
          req.session.userName = findUser.username;
          res.redirect("/");   
        } else {
          res.render("loginPage", { username: findUser.name,message: "Password is not matching" });
        } 
    } else {
      console.log("User is not found");
      res.render("loginPage", { username: "" ,message: "Invalid email or password" });
    }
  } catch (error) {
    res.redirect("/pageNotFound");
    res.render("loginPage", { username: "",message: "Invalid email or password" });
  }
};

// Function to load home page
const loadHomePage = async (req, res) => {
  try {
   const user = await User.findById(req.session.user)
    let username;
   if (user) {
     username = user.username;
  } else {
    username = '';
  }
   res.render("homePage", { username});
  } catch (error) {
    console.log('Error loading home page:', error.message);
  }
};

// Function to load sign up page
const loadSignUpPage = async (req, res) => {
  try {
    const username = req.session.user;
    res.render("signupPage", {username});
  } catch (error) {
    console.log('Error loading sign up page:', error.message);
    res.status(500).send('Error loading sign up page. Please try again later.');
  }
};
 
// Function to load login page
const loadLoginPage = async (req, res) => {
  try {
    const username = req.session.user;
    res.render("loginPage" , {username : ''});
  } catch (error) {
    console.log('Error loading login page:', error.message);
    res.status(500).send('Error loading login page. Please try again later.');
  }
};

const loadotpPage = async(req,res)=>{
  try {
    res.render("otpPage")
  } catch (error) {
    console.log("error in loading otp page")
  }
}

const userlogout = async(req,res)=>{
  try
  {
     req.session.user=null;
     req.session.userName=null;
     res.redirect('/');
  }catch(error){
    console.log(error.message);
  }
}



const loadShopPage = async (req, res) => {
  try {
    let username;
    const user = await User.findById(req.session.user)
   if (user) {
     username = user.username;
  } else {
    username = '';
  }
    const category = await Category.find({isUnlisted : false});
    const Products = await Product.find()
    

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find().skip(skip).limit(limit);



    res.render("ShoppingPage",{username,category,product:Products,page,
      totalPages,
      limit});
  } catch (error) {
    console.log('Error loading shopping page:', error.message);
    res.status(500).send('Error loading shopping page. Please try again later.', error);
  }
}; 


const loadSinglePage = async (req, res) => {
  try {

    const username = req.session.userName
    const email = req.session.email
    res.render("singleProduct",{username,email});
  } catch (error) {
    console.log('Error single shopping page:', error.message);
    res.status(500).send('Error single shopping page. Please try again later.', error);
  }
};



const getSingleProduct = async (req, res) => {
  try {
    const username = req.session.userName;
    const productId = req.query.id; 

    // Fetch product details from the database based on productId
    const product = await Product.findById(productId);

    // Render the single product page template with product details
    res.render('single_product', { username, product });
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    res.status(500).send('Error fetching product details. Please try again later.');
  }
};






module.exports = {
  loadHomePage,
  loadSignUpPage,
  loadLoginPage,
  sendOtp ,
  verifyOtp,
  loadotpPage,
  resendOTP,
  hashPassword, 
  comparePasswords,
  verifyLogin,
  userlogout,
  loadShopPage,
  loadSinglePage,
  getSingleProduct
};
