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

module.exports = {
  loadOrderPage
};
