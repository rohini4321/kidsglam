const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require("../models/userDataModel")
const Category = require("../models/categoryModel")
const Product = require("../models/productDataModel")


// rendering forgot password page
const getForgotPassword = async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    let username = user ? user.username : '';
    res.render("forgotpassword", { username });
  } catch (error) {
    console.log('Error loading forgot page', error.message);
    res.status(500).send('An error occurred while loading the page.');
  }
};


// to send the email
const sendmail = async (req, res) => {
  try {
    const email = req.body.email;
      req.session.email=email
      
    const user = await User.findOne({ email: email });
    console.log("User found:", user);

    if (!user) {
      return res.status(400).send('No account with that email found.');
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    req.session.otp = otp;
    
    

    // Log the OTP for debugging purposes (remove in production)
    console.log(`OTP for ${email}: ${req.session.otp}`);

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD
      }
    });

    const mailOptions = {
      to: email,
      from: process.env.GOOGLE_EMAIL,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}`
    };

  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).send('Error sending email.');
      }
      console.log('Email sent:', info.response);
      res.redirect('/enterotp');
    });


  } catch (error) {
    console.error('Error in postForgotPassword:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
};

// rendering the otp page
const enterOtp = async (req, res) => {
  try {
    

    res.render('enterotp',{username:''})
  } catch (error) {
    console.error('Error in postEnterOtp:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).send('No account with that email found.');
    }

    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    res.send('Your password has been successfully reset.');
  } catch (error) {
    console.error('Error in postResetPassword:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
};




const verifyOtp = (req, res) => {
  try {
    const enteredOtp = req.body.otp;
    const storedOtp = req.session.otp;

    if (enteredOtp !== storedOtp) {
      res.json({ success: false, message: 'OTP is invalid!' });
    } else {
      res.json({ success: true, message: 'OTP is valid!' });
    }
  } catch (error) {
    console.log("Error in verifying OTP", error);
    res.status(500).json({ success: false, message: 'An error occurred while verifying OTP.' });
  }
};




const fpResendOtp = async (req, res) => {
  try {
    const email = req.session.email;
    

    if (!email) {
      return res.status(400).send('No account with that email found.');
    }

    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    req.session.otp = otp;

    // Log the OTP for debugging purposes (remove in production)
    console.log(`Resent OTP for ${email}: ${req.session.otp}`);

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD
      }
    });

    const mailOptions = {
      to: email,
      from: process.env.GOOGLE_EMAIL,
      subject: 'Password Reset OTP',
      text: `Your new OTP for password reset is ${otp}. .`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).send('Error sending email.');
      }
      console.log('Email sent:', info.response);
      res.status(200).send('OTP has been resent.');
    });

  } catch (error) {
    console.error('Error in resendOtp:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
};

const loadResetPassword = (req, res) => {
  try {
    res.render("newPassword",{username :""})
  } catch (error) {
    console.log("error in loading newpassword page")

  }
};





const newPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  console.log("Request Body:", req.body);

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const email = req.session.email;
    console.log("Email from session:", email);

    // Find the user by email
    const user = await User.findOne({ email: email });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Send a success response
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};







module.exports = {
  getForgotPassword,
  sendmail,
  enterOtp,
  resetPassword,
  fpResendOtp, 
  verifyOtp,
  loadResetPassword,
  newPassword
  

};
