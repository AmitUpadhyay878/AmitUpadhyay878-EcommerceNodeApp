const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");
  
  const router = require("express").Router();
  const Bcrypt = require("bcrypt");
  const Product = require("../Models/Product");
  


//   Create Product

router.post("/",verifyTokenAndAdmin,async(req,res)=>{
        const newProduct= new Product(req.body)

        try{
                const savedProduct= await newProduct.save()
                res.status(200).json(savedProduct)
        }catch(err){
                    res.status(500).json(err)
        }
})


  // Mothod for Update
  router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
     
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
  
      res.status(200).json(updatedProduct);
    } catch (err) {
     
      res.status(500).json(err);
    }
  });
  
  //Method For Delete
  router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.param.id);
      res.status(200).json("Product has Deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //Method For Select  User By ID
  router.get("/find/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.param.id);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //Method For Select All Products
  router.get("/",async (req, res) => {
    
     //param pass from postman,thunder Client
      const qNew = req.query.new;
      const qCategory = req.query.category;
  
      try {
              let products;

                if(qNew){
                  products = await Product.find().sort({createdAt:-1}).limit(5)
                }else if(qCategory){
                  products = await Product.find({categories:{
                        $in:[qCategory],
                  }})  
                }else{
                  products = await Product.find();
                }

      res.status(201).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get("/status",verifyTokenAndAdmin,async(req,res)=>{
          const date = new Date()
          const lastYear =new Date(date.setFullYear(date.getFullYear()-1))  
  
          try{
              const data = await User.aggregate([
                  {$match:{createdAt:{$gte: lastYear}}},
                  { $project:{    
                              month:{$month:"$createdAt"}
                          },
                      },
                      {
                          $group:{
                              _id:"$month",
                              total:{$sum:1 }
                          }
                      }
              ])
              res.status(201).json(data)
          }catch(err){
              res.status(500).json(err)
          }
  })
  
  module.exports = router;
  