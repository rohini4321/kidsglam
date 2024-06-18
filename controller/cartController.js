const User = require("../models/userDataModel")
const Cart = require("../models/cartModel")
const Product = require("../models/productDataModel")


const getCart = async (req, res) => {
  const userID = req.session.user;
  // console.log("the userid",userID)
  try {
    const cart = await Cart.findOne({ userID }).populate('products.productId');
    // console.log("the cart",cart)
    if (!cart) {
      return res.render('cart', { products: [], username: req.session.username });
    }
    
    const products = cart.products.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));
    
    const user = await User.findById(userID);

    res.render('cart', { products,user, username:user.username });
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).send('Internal Server Error');
  }
};


const updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const userID = req.session.user;

  console.log("User ID:", userID);
  console.log("Product ID:", productId, "Quantity:", quantity);

  if (quantity > 5) {
    return res.json({ success: false, message: 'You cannot add more than 5 of the same product to the cart.' });
  }


  try {
      const cartItem = await Cart.findOne({ userID: userID });
      console.log("Cart Item:", cartItem);


      
  

      if (cartItem) {
          const index = cartItem.products.findIndex(item => item.productId.toString() === productId);
          console.log("Cart Product Index:", index);

          if (index !== -1) {
              // Update the quantity of the found product
              cartItem.products[index].quantity = quantity;
              console.log("Updated Cart Item:", cartItem.products[index]);

              // Save the updated cart
              await cartItem.save();
              res.json({ success: true });
          } else {
              res.json({ success: false, message: 'Product not found in cart' });
          }
      } else {
          res.json({ success: false, message: 'Cart not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
  }
};


const removeProduct = async (req, res) => {
  const { productId } = req.body;

  try {
      await Cart.findOneAndRemove({ 'productId': productId });
      res.json({ success: true });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
  }
};




// Add product to cart
const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userID = req.session.user;
  console.log("the details", productId, userID);

  try {
    let cart = await Cart.findOne({ userID });

    if (!cart) {
      cart = new Cart({ userID, products: [] });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex > -1) {
      cart.products[productIndex].quantity += 1; // Increment the quantity by 1
    } else {
      cart.products.push({ productId, quantity: 1 }); // Add the product with quantity 1
    }

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.session.user; // Assuming you have user session

  try {
      const cart = await Cart.findOne({ userID: userId });
      console.log("the cart",cart)
      if (!cart) {
          return res.status(404).send({ success: false, message: 'Cart not found' });
      }

      // Find the index of the product in the cart items array
      const index = cart.products.findIndex(item => item.productId.toString() === productId);
         
       console.log("the index",index)

      // Check if the product exists in the cart
      if (index === -1) {
          return res.status(404).send({ success: false, message: 'Product not found in cart' });
      }

      // Remove the item from the cart items array based on the index
      cart.products.splice(index, 1);

      // Save the updated cart
      await cart.save();

      res.status(200).send({ success: true });
  } catch (error) {
      res.status(500).send({ success: false, error: error.message });
  }
};




// Controller function for updating 

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  removeProduct
} 