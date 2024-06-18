const User = require("../models/userDataModel");
const Cart = require("../models/cartModel")
const Products = require("../models/productDataModel")
const loadCheckoutPage = async (req, res) => {
  try {


    const userId = req.session.user;
     console.log("userid",userId)
    // if (!userId) {
    //   throw new Error('User ID not found in session');
    // }
    const userdetails = await User.findById(userId)
    console.log("userdetails",userdetails)
    if (!userdetails) {
      throw new Error('User not found');
    }

    const cartItems = await Cart.findOne({userID:userId}).populate('products.productId');
    console.log("cartItem",cartItems.products)
    if(!cartItems){
    throw new Error(" User not found")
    }

    

    // console.log("address",userdetails.address)
    res.render("checkout", { address:userdetails.address, products:cartItems.products , username: userdetails.username || "" });
  } catch (error) {
    console.error('Error loading checkout page:', error.message, error.stack);
    res.status(500).send('Error loading checkout page');
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.session.user; 
    const addressId = req.params.id;
    console.log("the address",addressId)
    // Assuming addressId is the index or unique identifier for the address.
    const { StreetName, City, Landmark, Pincode, Country } = req.body;
    
    console.log("the",req.body)

    // Validate required fields
    if (!StreetName || !City || !Pincode || !Country) {
      return res.status(400).send('All required fields must be filled');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const addressIndex = user.address.findIndex(address => address._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).send('Address not found');
    }

    user.address[addressIndex] = {
      ...user.address[addressIndex],
      StreetName,
      City,
      Landmark,
      Pincode,
      Country
    };

    await user.save();
console.log("the user",user)
    res.status(200).send({ message: 'Address updated successfully' });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).send('Internal server error');
  }
};



const addAddress = async (req, res) => {
  try {
    const userId = req.session.user;
    const { StreetName, City, Landmark, Pincode, Country } = req.body;

    // Validate required fields
    if (!StreetName || !City || !Pincode || !Country) {
      return res.status(400).send('All required fields must be filled');
    }
    console.log("the address",req.body)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Create a new address object
    const newAddress = {
      StreetName,
      City,
      Landmark,
      Pincode,
      Country
    };

    // Add the new address to the user's address array
    user.address.push(newAddress);

    await user.save();
    res.status(200).send({ success: true, message: 'Address added successfully' });
  } catch (error) {
    console.error('Error adding new address:', error);
    res.status(500).send('Internal server error');
  }
};


const checkAvailability = async (req, res) => {
  try {
      const { selectedAddress } = req.body;
      const products = req.session.cart; // Assuming you have a cart stored in session

      for (let item of products) {
          const product = await Product.findById(item.productId);
          if (!product || product.stock < item.quantity) {
              return res.json({ success: false, message: 'Out of stock' });
          }
      }

      // Proceed to create order
      const order = new Order({
          user: req.user._id,
          address: selectedAddress,
          products: products.map(item => ({
              product: item.productId,
              quantity: item.quantity
          })),
          total: products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0)
      });

      await order.save();

      // Clear the cart
      req.session.cart = [];

      res.json({ success: true, orderId: order._id });
  } catch (error) {
      console.error(error);
      res.json({ success: false, message: 'An error occurred' });
  }
};
module.exports = {
  loadCheckoutPage,
  updateAddress,
  addAddress,
  checkAvailability
};
 