const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require("../models/userDataModel")
const Category = require("../models/categoryModel")
const Product = require("../models/productDataModel")



// loading profile page
const loadProfilePage = async (req, res) => {
  try {
    const userid = req.session.user;
    
    
    const user = await User.findById(userid);
    
    
    res.render("profile", { user, username:user.username});
  } catch (error) {
    console.log('Error loading profile page:', error.message);
  }
};

 
const editUserAndEmail = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userid = req.session.user;
    // console.log("the username",)

    // Find the user by current username and update their details
    const user = await User.findOneAndUpdate(
      { _id:userid },
      { username, email },
    
    );
     
    // Check if user was found and updated
    if (!user) {
      return res.status(404).send('User not found');
    }

       await user.save()
    

    return res.status(200).send({ok:true})
  } catch (error) {
    console.log('Error updating account details:', error.message);
    res.status(500).send('Server error');
  }
};


const resetPassword = async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;
    const userid = req.session.user;

    if (new_password !== confirm_password) {
      return res.status(400).send('New passwords do not match');
    }

    const user = await User.findOne({ _id: userid });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(400).send('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).send('Password updated successfully');
  } catch (error) {
    console.error('Error resetting password:', error.message);
    res.status(500).send('Server error');
  }
};
 

const updateAdress = async (req,res)=>{
  try {
    const userid = req.session.user;
    const user = await User.findById(userid);
    res.render("resetAddress", { user, username:user.username});
  } catch (error) {
    console.log('Error loading adress page:', error.message);
  }
  
}
   
const addNewAddress = async (req, res) => {
  try{
    console.log('address is', req.body)
  const { StreetName, City, Landmark, Pincode, Country } = req.body;

  if (!StreetName || !City || !Landmark || !Pincode || !Country) {
      return res.status(400).send('All fields are required.');
  }

  const userid=req.session.user;
  console.log('userid :', userid);
  const user=await User.findById(userid)
  console.log(`user : ${user}`);
      const newAddress ={
          StreetName,
          City,
          Landmark,
          Pincode,
          Country
      };
      user.address.push(newAddress)
console.log("the newaddress is",newAddress)
      await user.save();

      res.status(200).send('Address added successfully');
      
  } catch (error) {
      console.error(error);
      res.status(500).send('Error adding address');
  }
};
    

const deleteAddress = async (req, res) => {
    const index = req.params.id;
    const userId =req.session.user
    console.log("the address",index)
    try {
          const user = await User.findById(userId)
        // Find the address by ID and delete it
        // await user.address.findByIdAndDelete(addressId); 
        user.address.splice(index,1)
          await user.save()
        res.status(200).send('Address deleted successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while deleting the address.');
    }
};


const editAddress = async (req, res) => {
  try {
      const userId = req.session.user; 
    
      const addressId = req.params.id;
      const updatedAddress = req.body;

      const user = await User.findById(userId); 
      if (!user) {
          return res.status(404).send('User not found');
      }
 
      if (user.address && user.address[addressId]) {
          user.address[addressId] = updatedAddress;
          await user.save();
          return res.status(200).send('Address updated successfully');
      } else {
          return res.status(404).send('Address not found');
      }
  } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).send('Internal server error');
  }
};


module.exports = {
  loadProfilePage,  
  editUserAndEmail ,
  resetPassword,
  updateAdress,
  addNewAddress,
  deleteAddress,
  editAddress
}

