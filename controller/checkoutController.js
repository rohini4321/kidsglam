const User = require("../models/userDataModel");
const Cart = require("../models/cartModel")
const Products = require("../models/productDataModel")
const Order = require("../models/orderModel")


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


// const checkAvailability = async (req, res) => {
//   try {
//       const { selectedAddress } = req.body;
//       const products = req.session.cart; // Assuming you have a cart stored in session

//       for (let item of products) {
//           const product = await Product.findById(item.productId);
//           if (!product || product.stock < item.quantity) {
//               return res.json({ success: false, message: 'Out of stock' });
//           }
//       }

//       // Proceed to create order
//       const order = new Order({
//           user: req.user._id,
//           address: selectedAddress,
//           products: products.map(item => ({
//               product: item.productId,
//               quantity: item.quantity
//           })),
//           total: products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0)
//       });

//       await order.save();

//       // Clear the cart
//       req.session.cart = [];

//       res.json({ success: true, orderId: order._id });
//   } catch (error) {
//       console.error(error);
//       res.json({ success: false, message: 'An error occurred' });
//   }
// };


const checkStock = async (req, res) => {
  const { orderDetails } = req.body;
  
  try {
    const productIds = orderDetails.map(item => item.productId);
    const products = await Products.find({ _id: { $in: productIds } });
    
    let allInStock = true;
    let outOfStockItems = [];
    
    orderDetails.forEach(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      if (!product || product.stock < item.quantity) {
        allInStock = false;
        outOfStockItems.push({ productId: item.productId, availableStock: product ? product.stock : 0 });
      }
    });

    if (allInStock) {
      return res.json({ success: true, message: 'All items are in stock' });
    } else {
      return res.json({ success: false, message: 'Some items are out of stock', outOfStockItems });
    } 
  } catch (error) {
    console.error('Error checking stock:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};










const placeOrder = async (req, res) => {
  const { user, address, orderDetails, paymentMethod, billTotal, discount, subTotal } = req.body;
console.log("hhhhhhh",req.body)

// const productsdetail = await Products.findById(productId);
  try {
    // Create products array for the order
    const products = orderDetails.map(item => ({
      productId: item.productId,
     
      productName: item.productName,
      media: item.media,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price*item.quantity,
      cancelProduct: false,
      cancelReason: "",
      returnProduct: false,
      returnReason: "",
      productStatus: "pending"
    }));
     let billTotal=0
   for(i=0;i<products.length;i++)
    {
      billTotal+=products[i].subtotal
    }



    // Create new order object
    const newOrder = new Order({
      user: req.session.user,
      products,
      orderId:generateOrderId(),
      orderStatus: "pending",
      billTotal,
      discount,
      subTotal,
      address: address,
      paymentMethod,
      createdOn: new Date(),
      showDate: new Date().toLocaleDateString(),
      cancelAll: false,
      cancelReason: "",
      returnAll: false,
      returnReason: ""
    });

    // Save the order to the database
    await newOrder.save();

    // Update stock quantities in products collection
    for (const item of orderDetails) {
      await Products.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }

    return res.json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ success: false, message: 'Failed to place order' });
  }
};









const getAddressDetails = async (req, res) => {
  try {
      const userId = req.session.user;
      const addressId = req.params.id;

      // Find the user by their ID
      const user = await User.findById(userId);

      if (!user) {
          return res.json({ success: false, message: 'User not found' });
      }

      // Find the address by its ID within the user's addresses
      const address = user.address.id(addressId);
      console.log("addressjjjjjjjjjjjjjjjjj",address)

      if (address) {
          res.json({ success: true, address });
      } else {
          res.json({ success: false, message: 'Address not found' });
      }
  } catch (error) {
      console.error('Error fetching address details:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
};






const generateOrderId = () => {
  const digits = '0123456789';
  let orderId= 'ORD';
  for (let i = 0; i < 3; i++) {
    orderId += digits[Math.floor(Math.random() * 10)];
  }
  return  orderId;
};















const getCartDetails = async (req, res) => {
  try {
      const userId = req.session.user; 
      console.log("User ID:", userId);

      const cartItems = await Cart.find({ userID: userId }).populate('products.productId'); 
      console.log("Cart Items:", cartItems);

      // Collect all products from cart items
      const products = cartItems.flatMap(cartItem => cartItem.products);
      console.log("Products:", products);

      res.json({ success: true, cartItems: products });
  } catch (error) {
      console.error('Error fetching cart details:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
};




 






  module.exports = {
  loadCheckoutPage,
  updateAddress,
  addAddress,
  checkStock,
  placeOrder,
 getCartDetails ,
 getAddressDetails
  
};
 