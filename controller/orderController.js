const User = require("../models/userDataModel");
const Order = require("../models/orderModel");

const loadOrderPage = async (req, res) => {
  try {
    const userId = req.session.user;


    const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;


  const total = await Order.countDocuments();
  const orders = await Order.find().skip(skip).limit(limit);






    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    const user = await User.findById(userId);
    const order = await Order.find({ user: userId }).populate('products.productId');

    res.render('orderPage', { user, username: user.username, order,total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      orders });
  } catch (error) {
    console.error('Error loading order page:', error);
    res.status(500).send('Server error');
   
  }
};



const viewDetails = async (req, res) => {
  try {
    const userId = req.session.user;
     const { orderid } = req.query;
     
     console.log(orderid)
    const user = await User.findById(userId);
  
    const orderdetails= await Order.findById(orderid)
    res.render("view", { user, username: user.username, order: orderdetails}); // assuming one order per user
  } catch (error) {
    console.log('Error loading order details:', error.message);
    res.status(500).send('Error loading order details. Please try again later.');
  }
};




const cancelOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    console.log('ordeerrrr', order);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.redirect({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};






module.exports = {
  loadOrderPage,
  viewDetails,
  cancelOrder
 
};
