const mongoose=require('mongoose')

const Schema=mongoose.Schema

const userSchema=Schema({
    username:{
        type:String,
        required:true
    
    },
    email:{
        type:String,
        required:true
    },
   
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Number,
        default:0,
    
   
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    joinedDate:{
        type:Date,
        default:Date.now
    },
    address:[{
        StreetName: {
            type: String,
        },
        City: {
          type:String,
        },
        Landmark:{
            type:String,
        },
        Pincode:{
            type:Number,
        },
        Country:{
            type:String
        }}
        
        
    ],
        
    
})

module.exports=mongoose.model('user',userSchema)