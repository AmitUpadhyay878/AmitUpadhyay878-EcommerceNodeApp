const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");
  
  const router = require("express").Router();
  const Bcrypt = require("bcrypt");
  const Cart = require("../Models/Cart");
  


//   Create Product

router.post("/",verifyToken,async(req,res)=>{
        const newCart= new Cart(req.body)

        try{
                const savedCart= await newCart.save()
                res.status(200).json(savedCart)
        }catch(err){
                    res.status(500).json(err)
        }
})


  // Mothod for Update
  router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
     
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
  
      res.status(200).json(updatedCart);
    } catch (err) {
     
      res.status(500).json(err);
    }
  });
  
  //Method For Delete
  router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.param.id);
      res.status(200).json("Cart has Deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //Method For Get User Cart
  router.get("/find/:userId",verifyTokenAndAuthorization, async (req, res) => {
    try {
      const cart = await Cart.findOne({userId: req.params.userId});
      res.status(201).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //Method For Select Cart
  router.get("/",verifyTokenAndAdmin,async (req, res) => {

      try {
                const carts = await Cart.find()
                res.status(200).json(carts)
             
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
  