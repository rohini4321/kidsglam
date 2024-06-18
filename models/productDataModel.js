const mongoose=require('mongoose')

const productSchema=mongoose.Schema({

    productName:{
        type:String,
        required:true
    
    },
    description:{
        type:String,
        required:true
    },
   
    price:{
        type:Number,
        required:true
    },
    category:{
      type:String,
      required:true
    
    },
    stock:{
      type:Number,
      required:true
    
    },
    image:{
      type:[String],
      
 
    },
    isUnlisted:{
      type:Boolean,
      default:false

      
    },
    createdOn:{
      type:Date,
      default:Date.now
    },
    
    
    
    });

      const product =mongoose.model("product",productSchema);

      module.exports = product;

      