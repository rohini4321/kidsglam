const mongoose = require("mongoose");
const { Schema } =require("mongoose");

const cartSchema =new mongoose.Schema({
  userID:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  products:[
    {
      productId:{
        type:Schema.Types.ObjectId,
        ref:"product",
        required:true,

      },
      quantity:{
        type:Number,
        default:1,

      },
    },
  ],
});
const Cart = mongoose.model("Cart",cartSchema);

module.exports = Cart;