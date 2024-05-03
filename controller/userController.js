const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Assuming you have environment variables set up for security
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

// Function to compare password with hashed password using bcrypt
const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Function to send OTP via email
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to: email,
    subject: 'Your OTP ',
    text: `Your OTP is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

// Function to load OTP page
const loadOtpPage = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      throw new Error('Email is missing in request body.');
    }

    const otp = generateOTP();
    console.log(otp);
    req.session.otp = otp; // Store OTP in session securely 

    await sendOTP(email, otp);

    res.render('otpPage');
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).send(error.message);
  }
};

// In userController.js

let resendTimer; // Timer variable

// Function to start the resend timer
const startResendTimer = () => {
  resendTimer = setTimeout(() => {
    // Generate and send a new OTP after the timer expires
    const newOtp = generateOTP();
    req.session.otp = newOtp;
    sendOTP(email, newOtp);
  }, 60000); // 60 seconds
};

// Function to resend OTP
const resendOTP = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      throw new Error('Email is missing in request body.');
    }

    const otp = generateOTP();
    req.session.otp = otp; // Update OTP in session securely
    await sendOTP(email, otp);

    // Clear the previous timer and start a new one
    clearTimeout(resendTimer);
    startResendTimer();

    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(error.message);
  }
};


// Function to verify OTP
const verifyOtp = async (req, res) => {
  const enteredOtp = req.body.enteredOtp;
  const storedOtp = req.session.otp;
  // console.log(enteredOtp);
  // console.log(storedOtp);

  if (!enteredOtp) {
    res.status(400).json({ error: 'Entered OTP is missing in request body.' });
    return;
  }

  try {
    // Entered OTP is incorrect
    if (enteredOtp !== storedOtp) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    // OTP verified successfully
    delete req.session.otp;
    // Send redirect URL to the client
    res.json({ redirectURL: '/homepage' }); // Change '/homepage' to the actual URL of your homepage
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(error.message);
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

const loadotp  = async(req,res)=>{
  try {
    res.render("otpPage")
  } catch (error) {
    console.log("error in loading otp page")
  }
}
module.exports = {
  loadHomePage,
  loadSignUpPage,
  loadLoginPage,
  loadOtpPage ,
  verifyOtp,
  loadotp,
  resendOTP,
  hashPassword, // Export hashPassword function
  comparePasswords // Export comparePasswords function
};
