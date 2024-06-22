const User = require("../models/userDataModel");
const Order = require("../models/orderModel");

const loadOrderPage = async (req, res) => {
  try {
    const userId = req.session.user;

    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    const user = await User.findById(userId);
    const order = await Order.find({ user: userId }).populate('products.productId');

    res.render('orderPage', { user, username: user.username, order });
  } catch (error) {
    console.error('Error loading order page:', error);
    res.status(500).send('Server error');
  }
};



const viewDetails = async (req, res) => {
  try {
    const userId = req.session.user;

    const user = await User.findById(userId);
    const order = await Order.find({ user: userId }).populate('products.productId');
    res.render("view", { user, username: user.username, order: order[0] }); // assuming one order per user
  } catch (error) {
    console.log('Error loading order details:', error.message);
    res.status(500).send('Error loading order details. Please try again later.');
  }
};



module.exports = {
  loadOrderPage,
  viewDetails
};
