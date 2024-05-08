const mongoose=require('mongoose')

const Schema=mongoose.Schema

const categorySchema=Schema({
    categoryName:{
        type:String,
        required:true
    
    },
    isUnlisted:{
        type:Boolean,
        default:false
    },
   
    createdOn:{
        type:Date,
        default:Date.now
    },
    isDeleted:{
        type:Boolean,
        default:false
      }})

        module.exports=mongoose.model("category",categorySchema)