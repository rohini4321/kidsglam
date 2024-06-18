
const User = require("../models/userDataModel")
const Category = require("../models/categoryModel")
const Product = require("../models/productDataModel")


const loadOrderPage = async (req, res) => {
  try {
    const userid = req.session.user;
    
    
    const user = await User.findById(userid);
    
    
    res.render("orderPage", { user, username:user.username});
  } catch (error) {
    console.log('Error loading order page:', error.message);
  }
};
module.exports = {
loadOrderPage
}