const {model,Schema} = require("mongoose")



const productModel = new Schema({
title:{ type:String, required:true,unique:true},
description:{type:String, required:true},
img:{type:String, required:true,unique:true},
categories:{type:Array},
size:{type:String},
price:{type:Number,required:true},
color:{type:String}


},{timestamps:true})

module.exports = model("Product",productModel)


