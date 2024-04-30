const nodemailer = require('nodemailer');

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: "gmail",
  port: 587,
  secure: false,
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

// Function to load OTP page
const loadOtpPage = async (req, res) => {
  try {
    
    const { email} = req.body;
    console.log(`email : ${email}`)
    const otp = generateOTP();
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: 'rohiniksabu@gmail.com',
      subject: 'Your OTP',
      text: `Your OTP is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending OTP email:', error);
        res.status(500).send('Error sending OTP email. Please try again later.');
        return;
      }
      console.log('Email sent:', info.response);
      res.render("otpPage", { otp }); // Pass OTP value to render OTP page
    });
  } catch (error) {
    console.log('Error generating OTP:', error.message);
    res.status(500).send('Error generating OTP. Please try again later.');
  }
};

// Function to load home page
const loadHomePage = async (req, res) => {
  try {
    res.render("homePage");
  } catch (error) {
    console.log('Error loading home page:', error.message);
    res.status(500).send('Error loading home page. Please try again later.');
  }
};

// Function to load sign up page
const loadSignUpPage = async (req, res) => {
  try {
    res.render("signupPage");
  } catch (error) {
    console.log('Error loading sign up page:', error.message);
    res.status(500).send('Error loading sign up page. Please try again later.');
  }
};

// Function to load login page
const loadLoginPage = async (req, res) => {
  try {
    res.render("loginPage");
  } catch (error) {
    console.log('Error loading login page:', error.message);
    res.status(500).send('Error loading login page. Please try again later.');
  }
};

module.exports = {
  loadHomePage,
  loadSignUpPage,
  loadLoginPage,
  loadOtpPage // Exporting loadOtpPage function
};
