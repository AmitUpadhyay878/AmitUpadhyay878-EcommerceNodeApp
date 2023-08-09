const {model,Schema} = require("mongoose")

const userModel = new Schema({
// username:{ type:String},
firstname:{ type:String},
lastname:{ type:String},
email:{type:String},
password:{type:String},
phone:{type:String},
address:{type:String},
pincode: {type:String},
tc: {type:Boolean},
usAdmin:{
    type:Boolean,
    default:false,
},

},{timestamps:true})

module.exports = model("User",userModel)


