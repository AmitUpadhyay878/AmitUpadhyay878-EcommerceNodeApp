// import Section
const express = require("express");
//CORS
const cors = require('cors');

const app =express()
const mongoose = require("mongoose")
app.use(express.json());

// app.use(cors({ origin: true }));
app.use(cors())
// app.use(cors({
//     origin: '*'
// }));
app.options("*", cors());

require ("dotenv").config()

const userRoute = require("./Routes/user")
const authRoute = require("./Routes/auth")
const productRoute = require("./Routes/product")
const orderRoute = require("./Routes/order")
const cartRoute = require("./Routes/cart")
const stripeRoute = require("./Routes/stripe")


// Routes
app.use("/api/user",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/products",productRoute)
app.use("/api/orders",orderRoute)
app.use("/api/carts",cartRoute)
app.use("/api/checkout",stripeRoute)



// Mongo Database Connection
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("DB Connected")).catch((err)=>console.log("Error",err))

// Port Configuration
const Port = process.env.PORT;

// Default Route For Application
app.get("/",(req,res)=>{
            res.json("hello")
})


// localhost Post Listening 
app.listen(Port || 4545 ,()=>{
    console.log(`server is Ruunning on http://localhost:${Port}`)
})